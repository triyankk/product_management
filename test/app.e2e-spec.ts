import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let adminToken: string;

    beforeAll(async () => {
        // Connect to the database before running the tests
        await mongoose.connect(process.env.MONGO_URI);

        // Drop the database to ensure a clean state before running tests
        await mongoose.connection.db.dropDatabase();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Register and login a user to get a token
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'user-test@example.com',
                password: 'abcd',
                username: 'testuser',
                role: 'user',
            });

        const userRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'user-test@example.com',
                password: 'abcd',
            });

        accessToken = userRes.body.accessToken;

        // Register and login an admin to get an admin token
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'user-admin@example.com',
                password: 'adminpass',
                username: 'adminuser',
                role: 'admin',
            });

        const adminRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'user-admin@example.com',
                password: 'adminpass',
            });

        adminToken = adminRes.body.accessToken;

        // Create sample products
        await request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Sample Product 1',
                description: 'Description for Sample Product 1',
                price: 50,
            });

        await request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Sample Product 2',
                description: 'Description for Sample Product 2',
                price: 150,
            });
    });

    afterAll(async () => {
        // Drop the database and close the database connection after all tests
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await app.close();
    });

    // Authentication Tests
    it('should login user and return token', async () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user-test@example.com', password: 'abcd' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('accessToken');
                expect(res.body).toHaveProperty('user');
                expect(res.body.user).toHaveProperty('email', 'user-test@example.com');
            });
    });

    // User Registration Tests
    it('should register a new user', async () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: 'newuser',
                password: 'newpass',
                email: 'newuser1@example.com',
                role: 'user',
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('email', 'newuser1@example.com');
            });
    });

    // Products Tests
    it('should create a new product (admin only)', async () => {
        return request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'New Product',
                description: 'A new product description',
                price: 100,
            })
            .expect(201);
    });

    it('should get all products', async () => {
        return request(app.getHttpServer())
            .get('/products')
            .expect(200);
    });

    it('should get a product by ID', async () => {
        // Assuming a product with ID '1' exists
        const products = await request(app.getHttpServer())
            .get('/products')
            .expect(200);

        const productId = products.body[0]._id;

        return request(app.getHttpServer())
            .get(`/products/${productId}`)
            .expect(200);
    });

    it('should delete a product by name (admin only)', async () => {
        return request(app.getHttpServer())
            .delete('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'New Product' })
            .expect(200);
    });

    // Orders Tests
    it('should create a new order', async () => {
        // Create a new order
        const products = await request(app.getHttpServer())
            .get('/products')
            .expect(200);

        const productIds = products.body.map(product => product._id);

        return request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                userId: 'user-test@example.com', // Assuming user ID is known
                productIds: [
                    "product_id_1",
                    "product_id_2"
                ],
                totalAmount: 200,
            })
            .expect(201);
    });

    it('should get all orders', async () => {
        return request(app.getHttpServer())
            .get('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });

    it('should get a specific order by ID', async () => {
        // Assuming an order with ID '1' exists
        const orders = await request(app.getHttpServer())
            .get('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        const orderId = orders.body[0]._id;

        return request(app.getHttpServer())
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
