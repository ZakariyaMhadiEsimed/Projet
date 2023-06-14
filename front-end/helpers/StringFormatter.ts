import moment from 'moment'

class StringFormatter {
	/**
	 *
	 * @param   {string}        message to display with flag inside ( e.g. : '{0}' )
	 * @param   {array}         parameter list to put into message
	 */
	static ResponseMessageParser(message: string, parameter: Array<any>): string {
		let messageFormat = message
		const wordList = parameter

		if (messageFormat) {
			for (let i = 0; i < wordList.length; i++) {
				let dataToFormat = wordList[i]
				const firstPartDate = wordList[i].split('T') // get year month and day from date ( eg : 2020-11-07T11:32:20.440 to => 2020-11-07 )

				if (moment(firstPartDate[0], 'YYYY-MM-DD', true).isValid()) dataToFormat = moment(dataToFormat).format('DD-MM-YYYY à HH:mm:ss')

				let pos = messageFormat.indexOf('}')

				while (pos != -1) {
					pos = messageFormat.indexOf('x', pos + 1)
				}

				const regEx = new RegExp('\\{' + i + '\\}', 'gm')
				messageFormat = messageFormat.replace(regEx, dataToFormat)
			}
		}

		return messageFormat
	}
}

export default StringFormatter
