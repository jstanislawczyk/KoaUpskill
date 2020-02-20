import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { InvoiceRepository } from '../repository/InvoiceRepository';
import { Invoice } from '../entity/Invoice';

@Service()
export class InvoiceService {

    constructor(
        @InjectRepository()
        private readonly invoiceRepository: InvoiceRepository,
    ) {}

    async getAllInvoices(): Promise<Invoice[]> {
        return await this.invoiceRepository.find();
    }

    async getInvoiceById(id: string): Promise<Invoice> {
        return await this.invoiceRepository.findOne(id);
    }

    async getAllSupplierInvoices(supplierId: string): Promise<Invoice[]> {
        return await this.invoiceRepository.findAllBySupplier(supplierId);
    }

    async getAllManagerInvoices(managerId: string): Promise<Invoice[]> {
        return await this.invoiceRepository.findAllByManager(managerId);
    }

    async saveInvoice(invoice: Invoice): Promise<Invoice> {
        return await this.invoiceRepository.save(invoice);
    }
}
