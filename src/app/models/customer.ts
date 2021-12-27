export interface Customer {
    customerId: number;
    customerName: string;
    age: number;
    qualification: string;
    income: number;
    workExp: number;
    numHouseholds: number;
    region: string;
    state: string;
    address: string;
    accountBalance: number;
    relationshipTenure: number;
    numAccounts: number;
    accountType: string;
    employmentStatus: string;
}

export interface CustomerData {
    totalRecords: number;
    customers: Array<Customer>;
}

export interface DistinctValues {
    distinctValues: Array<string>;
}
