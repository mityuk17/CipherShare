import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_key() -> bytes:
    """Генерирует 32-байтный ключ для AES-256."""
    return os.urandom(32)

def encrypt_data(data: str, key: bytes) -> bytes:
    """
    Шифрует строковые данные с помощью AES-GCM.
    Генерируется 12-байтный nonce, который объединяется с зашифрованным текстом.
    """
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    return nonce + ciphertext

def decrypt_data(encrypted_data: bytes, key: bytes) -> str:
    """
    Дешифрует данные, полученные функцией encrypt_data.
    Извлекается nonce (первые 12 байт) и далее проводится расшифровка.
    """
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode()

def hash_key(key: bytes) -> str:
    """Вычисляет SHA-256 хеш от ключа и возвращает его в шестнадцатеричном виде."""
    return hashlib.sha256(key).hexdigest()
