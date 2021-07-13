export interface TransactionAPIInterface {
    TotalInputNanos: number;
    SpendAmountNanos: number;
    ChangeAmountNanos: number;
    FeeNanos: number;
    TransactionIDBase58Check: string;
    Transaction:
        | {
              TxInputs: TxnInputs;
              TxOutputs: TxnOutput[];
              TxnMeta: any;
              PublicKey: string;
              ExtraData: any;
              Signature: any;
              TxnTypeJSON: any;
          }
        | undefined;
    TransactionHex: string;
    TxnHashHex: string;
    error: string | undefined;
}
interface TxnInputs {
    TxID: number[];
    Index: number | undefined;
}

interface TxnOutput {
    PublicKey: string;
    AmountNanos: number;
}
