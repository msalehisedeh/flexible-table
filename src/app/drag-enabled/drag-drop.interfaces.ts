
export interface DragEvent {
    medium: any,
    node: HTMLElement,
    clientX?: number,
    clientY?: number,
    offset?: {
        x: number, 
        y: number
    }
}

export interface DropEvent {
    source: {
        medium: any,
        node: HTMLElement,
        clientX?: number,
        clientY?: number,
        offset?: {
            x: number, 
            y: number
        }
    },
    destination: {
        medium: any,
        node: HTMLElement,
        clientX?: number,
        clientY?: number
    }
}
