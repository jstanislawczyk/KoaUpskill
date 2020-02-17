import { Merchandise } from "../../../src/entity/Merchandise";

export class MerchandiseDataGenerator {
    public static createMerchandise(name: string, price: number, quantity: number) {
        const merchandise = new Merchandise();

        merchandise.name = name;
        merchandise.price = price;
        merchandise.quantity = quantity;

        return merchandise;
    }
}
