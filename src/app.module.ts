import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './product/products.module';
import { OrdersModule } from './orders/orders.module';

const dbUsername = "triyankk"


@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://localhost/${dbUsername}`
    ), UsersModule, ProductsModule, OrdersModule
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    Logger.log(`AppModule initialized, connected to: ${dbUsername} `);

  }
}

