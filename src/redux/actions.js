export const token = 'token'
export const id_user = 'id_user'
export const location = 'location'
export const estado = 'estado'
export const conexion = 'conexion'
export function createToken(text){
    return { type: token, text }
}

export function createId(text){
    return { type: id_user, text }
}

export function createEstado(text){
    return { type: estado, text }
}

export function setConexion(text){
    return { type: conexion, text }
}

export function setLocation(text){
    return { type: location, text }
}