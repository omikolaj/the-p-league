export function enumKeysToArray<T>(incomingEnum: T): string[] {
	const enumKeysAndValues = Object.keys(incomingEnum);	
	if (incomingEnum['None'] !== undefined || incomingEnum['None'] !== null) {
		const valuesArray: string[] = enumKeysAndValues.slice(enumKeysAndValues.length / 2).filter((name) => name !== incomingEnum[incomingEnum['None']]);		
		return valuesArray;
	}
	console.error("EnumToArray function could not find 'none' key in the passed in enum. Make sure your enum contains 'none' as one of its keys");
}
