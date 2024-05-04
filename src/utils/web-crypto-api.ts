//----------------------------------------------------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------------------------------------------------

const DEFAULT_SETTINGS = {
    hash: "SHA-512" as "SHA-256" | "SHA-512",
    algorithm: "AES-GCM" as "AES-CTR" | "AES-CBC" | "AES-GCM",
    length: 256 as number,
    iterations: 250_000 as number,
} as const;

export const TEST_CIPHERTEXT = `
    eyJ2ZXJzaW9uIjoxLCJzZXR0aW5ncyI6eyJoYXNoIjoiU0hBLTUxMiIsImFsZ29yaXRobSI6IkFFUy1H
    Q00iLCJsZW5ndGgiOjI1NiwiaXRlcmF0aW9ucyI6MjUwMDAwfSwic2FsdCI6IlIzNlZhMlZjWTEyR2wz
    WDdkKy9sZnc9PSIsIml2IjoibzhUTGg5SFV0RWxYOFZLNSIsImNvbnRlbnQiOiJoT3dCTHc2L3VkQnRz
    OXVUQUgzRktpalI1eVIxRTF5ODQxOTBVSHlOelNFclVyUUVWU1Ewb3NXVmFjUkwzcGEwdVhlUHVPQWVx
    Q0hlYlZoQ2dmWUVDWkZlUDFUTG54Q3RISWFxckp2K0lxdmd0cnJGU2hPV1prWWdPSWtMMTVia3AxMCt0
    YkFWa1NLc2tLZzY0dDlxK2hubWZPWjBaeHE5VEc5R3ZNZTIrQkpZdlk2ZGk0am9rRml5NlJuaVZYclNn
    UC9VSXhTZWtuTT0ifQ==
`;

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

type Settings = typeof DEFAULT_SETTINGS;

type EncryptedData = {
    version: 1;
    settings: Settings;
    salt: string;
    iv: string;
    content: string;
};

//----------------------------------------------------------------------------------------------------------------------
// Encrypt
//----------------------------------------------------------------------------------------------------------------------

export async function encrypt(password: string, content: string) {
    try {
        const settings = DEFAULT_SETTINGS;
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await deriveKey(password, salt, settings);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(content);
        const encrypted = await window.crypto.subtle.encrypt({ name: settings.algorithm, iv }, key, encoded);
        const encryptedData: EncryptedData = {
            version: 1,
            settings,
            salt: toBase64(salt),
            iv: toBase64(iv),
            content: toBase64(new Uint8Array(encrypted)),
        };
        return btoa(JSON.stringify(encryptedData));
    } catch (ignored) {
        console.log(ignored);
        return undefined;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Decrypt
//----------------------------------------------------------------------------------------------------------------------

export async function decrypt(password: string, encryptedData: string) {
    try {
        const parsedEncryptedData = JSON.parse(atob(encryptedData)) as EncryptedData;
        const settings = parsedEncryptedData.settings;
        const salt = base64ToUint8Array(parsedEncryptedData.salt);
        const iv = base64ToUint8Array(parsedEncryptedData.iv);
        const content = base64ToUint8Array(parsedEncryptedData.content);
        if (salt && iv && content) {
            const key = await deriveKey(password, salt, settings);
            const decrypted = await window.crypto.subtle.decrypt({ name: settings.algorithm, iv }, key, content);
            return new TextDecoder().decode(decrypted);
        } else {
            return undefined;
        }
    } catch (ignored) {
        return undefined;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Derive the key
//----------------------------------------------------------------------------------------------------------------------

async function deriveKey(password: string, salt: Uint8Array, settings: Settings) {
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: settings.iterations, hash: settings.hash },
        await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]),
        { name: settings.algorithm, length: settings.length },
        false,
        ["encrypt", "decrypt"]
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Utility functions
//----------------------------------------------------------------------------------------------------------------------

function toBase64(uInt8Array: Uint8Array) {
    return btoa(String.fromCharCode(...uInt8Array));
}

function base64ToUint8Array(base64: string) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
