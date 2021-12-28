export class CommonUtils {

    static shouldFetchDistinctCategorical(field: string) {
        return field !== 'customerName' && field !== 'address';
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
