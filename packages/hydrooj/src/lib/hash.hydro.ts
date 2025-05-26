import crypto from 'crypto';

async function hash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            salt,
            260000, // 迭代次数
            32, // 输出32字节
            'sha256',
            (err, derivedKey) => {
                if (err) reject(err);
                else resolve(derivedKey.toString('base64')); // Base64编码
            },
        );
    });
}

// 导出模块，符合您提供的原始结构
export default hash;
global.Hydro.module.hash.hydro = hash;
