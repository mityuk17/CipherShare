import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_key() -> bytes:
    """Generates a 32-byte key for AES-256."""
    return os.urandom(32)

def encrypt_data(data: str, key: bytes) -> bytes:
    """
    Encrypts string data using AES-GCM.
    A 12-byte nonce is generated and combined with the encrypted text.
    """
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    return nonce + ciphertext

def decrypt_data(encrypted_data: bytes, key: bytes) -> str:
    """
    Decrypts data encrypted with the encrypt_data function.
    Extracts the nonce (first 12 bytes) and then performs decryption.
    """
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode()

def hash_key(key: bytes) -> str:
    """Computes the SHA-256 hash of the key and returns it as a hexadecimal string."""
    return hashlib.sha256(key).hexdigest()
