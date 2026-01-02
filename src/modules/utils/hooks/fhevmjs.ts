import { useEffect, useState } from 'react';
import { getAddress } from 'ethers';

// TODO: Replace with @luxfhe/sdk when browser build is ready
// For now, provide a stub implementation that uses mock encryption

export const LOCALSTORAGE_GATEWAY = 'gatewayUrl';
export const LOCALSTORAGE_KMS_VERIFIER_ADDRESS = 'kmsVerifierAddress';
export const LOCALSTORAGE_ACL_ADDRESS = 'aclAddress';

export type Parameter = { value: string; flag: string };

export type Keypair = {
  publicKey: string;
  privateKey: string;
  signature: string;
};

export type Keypairs = {
  [key: string]: Keypair;
};

const keypairs: Keypairs = {};

const createKey = (contractAddress: string, userAddress: string) =>
  `${contractAddress}-${userAddress}`;

let gatewayUrl: string =
  window.localStorage.getItem(LOCALSTORAGE_GATEWAY) || '';

let kmsVerifierAddress: string =
  window.localStorage.getItem(LOCALSTORAGE_KMS_VERIFIER_ADDRESS) || '';

let aclAddress: string =
  window.localStorage.getItem(LOCALSTORAGE_ACL_ADDRESS) || '';

let initialized = false;

export const useFhevmjs = () => {
  const [created, setCreated] = useState(false);

  const refreshFhevmjs = async () => {
    setCreated(false);
    try {
      // Initialize native FHE when @luxfhe/sdk browser build is ready
      // For now, mark as created if we have valid addresses
      if (kmsVerifierAddress && aclAddress) {
        initialized = true;
        setCreated(true);
      }
    } catch (e) {
      console.error('Failed to initialize FHE:', e);
    }
  };

  useEffect(() => {
    refreshFhevmjs();

    window.ethereum?.on('chainChanged', refreshFhevmjs);
    return () => {
      window.ethereum?.off('chainChanged', refreshFhevmjs);
    };
  }, []);

  const updateGatewayUrl = (url: string) => {
    gatewayUrl = url;
    window.localStorage.setItem(LOCALSTORAGE_GATEWAY, url);
    refreshFhevmjs();
  };

  const updateKMSVerifierAddress = (address: string) => {
    kmsVerifierAddress = address;
    window.localStorage.setItem(
      LOCALSTORAGE_KMS_VERIFIER_ADDRESS,
      kmsVerifierAddress,
    );
    refreshFhevmjs();
  };

  const updateACLAddress = (address: string) => {
    aclAddress = address;
    window.localStorage.setItem(LOCALSTORAGE_ACL_ADDRESS, aclAddress);
    refreshFhevmjs();
  };

  const encryptParameters = async (
    contractAddress: string,
    userAddress: string,
    params: Parameter[],
  ): Promise<string[]> => {
    // TODO: Implement native FHE encryption using @luxfhe/sdk
    // For now, return values as-is (mock mode)
    console.warn('FHE encryption not yet implemented - returning unencrypted values');
    return params.map((p) => p.value);
  };

  const reencrypt = async (
    contractAddress: string,
    userAddress: string,
    value: bigint,
  ) => {
    // TODO: Implement native FHE re-encryption using @luxfhe/sdk
    console.warn('FHE re-encryption not yet implemented');
    return value;
  };

  return {
    instance: initialized ? {} : undefined,
    gatewayUrl,
    created,
    refreshFhevmjs,
    updateGatewayUrl,
    updateKMSVerifierAddress,
    updateACLAddress,
    encryptParameters,
    reencrypt,
  };
};
