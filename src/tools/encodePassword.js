import md5 from "md5";
import { config } from '../config';

const {salt} = config;

const encodePassword = (pwd) => {
    return md5(md5(pwd) + salt);
}

export default encodePassword;