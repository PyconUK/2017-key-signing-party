Please create .yaml files with:


```yaml
# /keys/[username].yaml
name: <your name as on your ID and PGP identity>
fingerprint: <your PGP fingerprint>


OpenPGP key signing party
=========================
This year we are resurrecting the PyConUK [OpenPGP Key-signing party](https://en.wikipedia.org/wiki/Key_signing_party)!  This involves meeting people to verify their online cryptographic identities in person.  This can be a great way to meet new people and get started with personal cryptography.  PGP [has recently been in the news](https://www.nytimes.com/2013/08/18/magazine/laura-poitras-snowden.html), as this is how investigative journalists can securely communicate with inside sources and whistle-blowers. However, this is not just for those who need it for their safety - it's also a useful thing to have for authenticating commits in open source projects and the more people who are authenticated, the easier it is for others to join the party!  For those in-the-know, we will be implementing the [Zimmermann–Sassaman key-signing protocol](https://en.wikipedia.org/wiki/Zimmermann%E2%80%93Sassaman_key-signing_protocol#Sassaman-Efficient).  If you do not already have a PGP key, and would like to get started with personal cryptography, please come along with your devices and we will help you get setup.  Alongside this, there will also be time for verifying other types of digital identities e.g. those used by Whatsapp / Signal / Telegram etc.

Before the event
----------------
In order to verify everyone efficiently, we ask for participants to try to generate their keys before the big day (see details below) and submit these either as pull request to  https://github.com/PyconUK/2017-key-signing-party or email them to python-pgp@graingert.co.uk.  If you have any issues doing this, we can help you on the day.

What to bring?
--------------
* Government issued ID
Please note:  for those with existing keys, that your ID must match exactly the identity used on the PGP key you wish to have verified e.g. if your key says Lizzy but your ID says Elizabeth, you will need to add a new identity to your key.
* If you do not have a PGP key, please come with a device with an OpenPGP implementation installed (please see Install below) and we will talk you through how to get started.  This does not need to be a laptop - there are available implementations for iOS and Android devices also.

Install
=======

Install an OpenPGP implementation:

    * Mac: https://gpgtools.org/ `brew cask install gpgtools`
    * Windows: https://www.gpg4win.org/ `choco install gpg4win`
    * Linux (desktop): Should be already installed. You might need to upgrade
      to a package called `gnupg2`
    * Android: https://www.openkeychain.org/
    * iOS: https://privacyapp.io/
