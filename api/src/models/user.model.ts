import { Model, Optional } from 'sequelize';

type UserAttributes = {
    id: number;
    username: string;
    password: string;
    email: string;
    fullName: string;
};

type UserCreationAttributes = Optional<UserAttributes, 'fullName'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare username: string;
    declare password: string;
    declare email: string;
    declare fullName: string;
}

export { User };