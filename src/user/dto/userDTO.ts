import { Column, Entity,  } from "typeorm"

@Entity("users")
export class UserDTO {

    @Column({ unique: true, nullable: false })
    phoneNumber: string
    @Column({ length: 25, nullable: true })
    firstName: string
    @Column({ length: 25, nullable: true })
    lastName: string
    @Column({ select: false, nullable: true })
    password: string


}