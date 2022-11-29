export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: Date;
  AWSEmail: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
  BigInt: any;
  Double: any;
};

export enum CountryCode {
  Br = 'BR',
  Cm = 'CM'
}

export type CountryTally = {
  __typename?: 'CountryTally';
  country: CountryCode;
  tally: Scalars['Int'];
  updatedAt?: Maybe<Scalars['AWSDateTime']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  plusOne?: Maybe<Vote>;
};


export type MutationPlusOneArgs = {
  input: VoteInput;
};

export type Query = {
  __typename?: 'Query';
  getTotals: Array<Maybe<CountryTally>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onPlusOne?: Maybe<Vote>;
};

export type Vote = {
  __typename?: 'Vote';
  country: CountryCode;
  guestId: Scalars['String'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  msgId: Scalars['Int'];
};

export type VoteInput = {
  country: CountryCode;
  guestId: Scalars['String'];
  msgId: Scalars['Int'];
};
