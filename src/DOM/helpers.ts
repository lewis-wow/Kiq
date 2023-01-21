export const isEvent = (key: string) => key.startsWith('on')

export const getEventName = (key: string) => key.replace('on', '')

export const isProperty = (key: string) => key !== 'children'
