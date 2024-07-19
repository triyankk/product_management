export class CreateOrderDto {
    readonly userId: string;
    readonly productIds: string[];
    readonly totalAmount: number;
}
