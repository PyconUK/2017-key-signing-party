import yaml
from gnupg import GPG
from pathlib import Path

KEY_SERVER = 'hkps://hkps.pool.sks-keyservers.net'


def main():
    gpg = GPG()
    for keyfile in Path('keys').iterdir():
        with keyfile.open('r') as f:
            key = yaml.load(f)
        import_result = gpg.recv_keys(KEY_SERVER, key['fingerprint'])
        print(f'Imported key {import_result.fingerprints[0]} - {key["name"]}')


if __name__ == '__main__':
    main()