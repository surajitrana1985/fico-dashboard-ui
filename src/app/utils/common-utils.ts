import { TableColumn } from "../models/table-column";

export class CommonUtils {

    static shouldFetchDistinctCategorical(item: TableColumn) {
        return item.type !== 'numeric' && item.field !== 'customerName' && item.field !== 'address';
    }

    static shouldFetchCategorical(field: string) {
        return field !== 'customerName' && field !== 'address';
    }

    static shouldFetchDistinctNumeric(item: TableColumn) {
        return item.type === 'numeric' && item.field !== 'customerId';
    }

    static isJoinOperator(numericStepFilterTypes: Array<string>, operator: string) {
        return numericStepFilterTypes.includes(operator);
    }

    static getCleanUpFilterParam(item: any) {
        const cleanUpFilterParam: any = {};
        const attributes: Array<string> =
            ['operators', 'rangeOperators', 'showOperator1',
                'showOperator2', 'multiselect', 'values', 'header'];
        for (let key of Object.keys(item)) {
            cleanUpFilterParam[key] = {};
            for (let subKey of Object.keys(item[key])) {
                if (!attributes.includes(subKey)) {
                    cleanUpFilterParam[key][subKey] = item[key][subKey];
                }
                if (subKey === 'operator' && item[key][subKey] !== '' && item[key]['value1'] !== '' && !item[key]['operator1']) {
                    cleanUpFilterParam[key]['operator1'] = item[key]['operator'];
                    delete cleanUpFilterParam[key]['operator'];
                }
            }
        }
        return cleanUpFilterParam;
    }

}
