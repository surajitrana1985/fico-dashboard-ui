import { TableColumn } from "../models/table-column";

export class CommonUtils {

    static shouldFetchDistinctCategorical(item: TableColumn) {
        return item.type !== 'numeric' && item.field !== 'customerName' && item.field !== 'address';
    }

    static shouldFetchDistinctNumeric(item: TableColumn) {
        return item.type === 'numeric' && item.field !== 'customerId';
    }

    static isJoinOperator(numericStepFilterTypes: Array<string>, operator: string) {
        return numericStepFilterTypes.includes(operator);
    }

    static cleanUpParam(item: any, attribute: string) {
        for (let key of Object.keys(item)) {
            if (item[key].hasOwnProperty(attribute)) {
                delete item[key][attribute];
            }
        }
        return item;
    }

}
