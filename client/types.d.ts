type UseStateFunc<T> = React.Dispatch<React.SetStateAction<T>>
type FC<T={}> = React.FC<T & {
    children?: React.ReactNode
}>

type Pretty<T> = {
    [K in keyof T]: T[K]
} & {}

// Exclude 
// Omit
// Partial
// Required
// ReturnOf
// Pick

type FormEvent =  React.FormEvent<HTMLFormElement>
type FormTarget<T={}, O={}> = FormEvent & {
    target:{
        [key in keyof T] : {value: string}
    }
} & O
