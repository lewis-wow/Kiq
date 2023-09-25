export type Ref<THTMLElement extends HTMLElement> = (element: THTMLElement) => void

export const useRef = <THTMLElement extends HTMLElement>(ref: Ref<THTMLElement>) => ref
