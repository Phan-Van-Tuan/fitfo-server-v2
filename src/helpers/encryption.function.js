import bcrypt from 'bcrypt';

const hashCode = async (data) => {
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(data, salt);
    return result;
}

const compareCode = async (data, trueValue) => {
    return await bcrypt.compare(data, trueValue);
}

export { hashCode, compareCode };