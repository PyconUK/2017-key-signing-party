# OpenPGP Key Signing Party

This year we are resurrecting the [PyConUK OpenPGP Key-signing party](http://2017.pyconuk.org/sessions/workshops/key-signing-party/)! This involves meeting people to verify their online cryptographic identities in person. Read more on [the Wikipedia page about key-signing parties](https://en.wikipedia.org/wiki/Key_signing_party).

It's a great way to meet new people and get started with personal cryptography. PGP is how investigative journalists can securely communicate with inside sources and whistle-blowers, however, this is not just for those who need it for their safety—it's also a useful thing to have for authenticating commits in open source projects.


### Joining the Party

The party (episode 2) will be on Sunday the 29th October at 12:30 in Room D. To get involved you must submit your key beforehand.

To do so, just create a YAML file in the `keys` directory. The filename should match your GitHub username.

```yaml
# /keys/[username].yaml
name: <your name as on your ID and PGP identity>
fingerprint: <your PGP fingerprint>
```

Tips:

 - Your name must match the name in your ID (where possible).
 - Your name must match the name in your PGP Identity (if you don't know what this means don't worry, we can help you on the day).
 - Use your key _fingerprint_, not the key ID. The fingerprint is 40 characters long, but might have spaces or start with `0x`.


### Event Format

For those in-the-know, we will be implementing the [Zimmermann–Sassaman key-signing protocol](https://en.wikipedia.org/wiki/Zimmermann%E2%80%93Sassaman_key-signing_protocol#Sassaman-Efficient).

If you do not already have a PGP key, and would like to get started with personal cryptography, please come along with your devices and we will help you get setup. Alongside this, there will also be time for verifying other types of digital identities e.g. those used by WhatsApp/Signal/Telegram etc.


### Before the Event

In order to verify everyone efficiently, we ask for participants to try to generate their keys before the big day (see details below) and submit these either as pull request to https://github.com/PyconUK/2017-key-signing-party or email them to python-pgp@graingert.co.uk. If you have any issues doing this, we can help you on the day.

### What to bring?

* **Government issued ID**—Please note, for those with existing keys, that your ID should, if possible, exactly match the identity used on the PGP key you wish to have verified e.g. if your key says Lizzy but your ID says Elizabeth, you will need to add a new identity to your key. If you do not know how to do this we can help you. If this is not possible (your chosen name and legal name differ, or you do not posses such ID), don't worry you can still participate, but signing parties may choose to assign a lower validity rating to your key.

* If you do not have a PGP key, please come with a device with an OpenPGP implementation installed (please see Install below) and we will talk you through how to get started. This does not need to be a laptop - there are available implementations for iOS and Android devices also.

### Install

Install an OpenPGP implementation:

* Mac: https://gpgtools.org/ `brew cask install gpgtools`
* Windows: https://www.gpg4win.org/ `choco install gpg4win`
* Linux (desktop): Should be already installed. You might need to upgrade
  to a package called `gnupg2`
* Android: https://www.openkeychain.org/
* iOS: https://privacyapp.io/

## After the event

You should now have a table with a set of validated fingerprints and ids. You
can use this to now sign any of those identities that you have personally
validated.

This guide is written assuming you have `gpg2` installed as `gpg` if any of
these commands fail, you can try using `gpg2` instead.

### The table

An example of a filled in table, noting validated fingerprints:

| name                  | fingerprint                  | fp verified | id verified |
| --------------------- | ---------------------------- | ----------- | ----------- |
| Elizabeth Mathis      | aaaa aaaa aaaa aaaa aaaa ... | no          | n/a         |
| Kimberly Duncan       | bbbb bbbb bbbb bbbb bbbb ... | yes         | yes         |
| Amy Lambert           | cccc cccc cccc cccc cccc ... | yes         | no          |
| Bill North            | dddd dddd dddd dddd dddd ... | yes         | William     |

### Anatomy of a PGP identity.

PGP identities are RFC2822 email address headers, they include a name, an
optional comment and a mail address:

```
John Smith (this is a test) tagrain@example.com
└────┬───┘ └──────┬───────┘ └────────┬────────┘
    name       comment             mail
```

### Importing the keys.

I've includes a file in this repository `./keys.asc` that contains a dump of
every key that was submitted to this repository over the course of PyCon UK.
Do not sign every one of these keys: some of them you may have validated, some
of them you may not have. Only sign the keys with fingerprints that you have
personally validated.

To import the keys on the command line run:

```
gpg --import path/to/keys.asc
```

### Sigining the keys.

For each of the fingerprints you have validated run:

```
gpg --sign-key --ask-cert-level --ask-cert-expire <fingerprint>
```

### Choosing a certification level.

You will be given the option to choose a "certification" level this is a value
that you should personally choose:

For example:

* if you have marked a fingerprint as not `fp verified` do not sign.
* If you have marked a fingerprint as `id verified` and you are very sure of
  this person's identity pick 3 (I have done very careful checking).
* If you have marked a fingerprint as not `id verified` then you may want to
  choose 2 (I have done casual checking), Unless you feel that person has
  sufficiently convinced you of their identity using other means, then you may
  wish to choose 3 (I have done very careful checking) anyway.
* If you have added extra notes, eg this person claims to be called "Bill North"
  but their ID claimed that they are "William North" you will have to make your
  own judgment call on which certification level to assign.

If you feel you want to mark every fingerprint as 3 or 2 that's totally up to
you. The certification level should be up to your own judgment and your own
trust in your ability to carefully validate fingerprints and identities.

### Sending your signature to the key owners

Debian signing guidlines recommend encrypting your signature and sending it
on a case by case basis to each participant:

```
gpg --armor --export <fingerprint> | gpg --encrypt -r <fingerprint> --armor --output <fingerprint>-signed.asc 
```

Another easier option is to run:

```
gpg --send-keys <fingerprint>
```

for each fingerprint of the keys that you have signed.

Unless the person you are signing has specifically requested that you send
the signature in a specific way, you are free to choose the method.


### See what happened

If you periodically run:

```
gpg --recv-keys
```

Or search for your own key on a keyserver, you will be able to see the
signatures you have made and those that others have made in an ever expanding
web of trust!
