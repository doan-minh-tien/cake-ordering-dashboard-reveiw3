


export type IBarkery = {
    id: string
    bakeryName: string,
    email: string,
    password: string,
    phone:string,
    address: string,
    ownerName: string
    avatarFileId: string,
    avatarFile : IAvatar,
    identityCardNumber: string,
    frontCardFileId: string,
    
}

export type IAvatar = {
    fileName: string,
    fileUrl : string,
    id: string
}