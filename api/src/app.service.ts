import { Injectable } from '@nestjs/common';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import { verifyCredential } from 'did-jwt-vc';
import { EthrDID, KeyPair } from 'ethr-did';
import { ethers, Wallet } from 'ethers';
@Injectable()
export class AppService {
  getHello(): string {
    const providerConfig = {
      // While experimenting, you can set a rpc endpoint to be used by the web3 provider
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      // You can also set the address for your own ethr-did-registry (ERC1056) contract
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      name: 'sepolia', // this becomes did:ethr:development:0x...
    };

    const ethrDidResolver = getResolver(providerConfig);
    const didResolver = new Resolver(ethrDidResolver);

    didResolver
      .resolve('did:ethr:sepolia:0x4D044d473b590169467DD2B6291F4273e2951d58')
      .then((result) => console.dir(result, { depth: 3 }))
      .catch((error) => console.error(error));
    return 'Hello World!';
  }

  async registerDID(): Promise<void> {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY!!;

    const privateKey = process.env.PRIVATE_KEY!!;
    const wallet = new Wallet(privateKey);
    const pubkey = wallet.signingKey.publicKey;
    const address = wallet.address;

    const provider = new ethers.AlchemyProvider('sepolia', alchemyApiKey);
    const txSigner = new Wallet(privateKey, provider);

    const keypair: KeyPair = {
      privateKey,
      publicKey: pubkey,
      address,
      identifier: pubkey,
    };
    // ユーザーのDID作成
    const ethrDid = new EthrDID({
      ...keypair,
      provider: provider,
      txSigner: txSigner, // こいつを渡さないと失敗する https://github.com/uport-project/ethr-did/issues/81#issuecomment-1030181286
      chainNameOrId: 'sepolia',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
    });
    // DID登録
    await ethrDid.setAttribute(
      'did/pub/Secp256k1/sigAuth/hex',
      pubkey,
      31104000,
    );
  }

  async issueVc(
    hodlerAddress: string,
    type: string,
    name: string,
  ): Promise<string> {
    const vcpayload = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      issuer: 'did:ethr:sepolia:0x145242286AE8184cA885E6B134E1A1bA73858BE8',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:ethr:sepolia:${hodlerAddress}`,
        degree: {
          type: type,
          name: name,
        },
      },
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: new Date().toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod:
          'did:ethr:sepolia:0x145242286AE8184cA885E6B134E1A1bA73858BE8#delegate-1',
      },
    };

    const alchemyApiKey = process.env.ALCHEMY_API_KEY!!;
    const privateKey = process.env.PRIVATE_KEY!!;
    const wallet = new Wallet(privateKey);
    const pubkey = wallet.signingKey.publicKey;
    const address = wallet.address;

    const provider = new ethers.AlchemyProvider('sepolia', alchemyApiKey);
    const txSigner = new Wallet(privateKey, provider);

    const keypair: KeyPair = {
      privateKey,
      publicKey: pubkey,
      address,
      identifier: address,
    };
    // ユーザーのDID作成
    const ethrDid = new EthrDID({
      ...keypair,
      provider: provider,
      txSigner: txSigner, // こいつを渡さないと失敗する https://github.com/uport-project/ethr-did/issues/81#issuecomment-1030181286
      chainNameOrId: 'sepolia',
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
    });

    const vc = await ethrDid.signJWT(vcpayload);
    return vc;
  }

  async verifyVc(vc: string): Promise<boolean> {
    const providerConfig = {
      // While experimenting, you can set a rpc endpoint to be used by the web3 provider
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      // You can also set the address for your own ethr-did-registry (ERC1056) contract
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      name: 'sepolia', // this becomes did:ethr:development:0x...
    };

    // It's recommended to use the multi-network configuration when using this in production
    // since that allows you to resolve on multiple public and private networks at the same time.

    // getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
    const ethrDidResolver = getResolver(providerConfig);
    const didResolver = new Resolver(ethrDidResolver);
    try {
      await verifyCredential(vc, didResolver);
      return true;
    } catch (error) {
      return false;
    }
  }
}
