import { Button } from './ui/button';
import { XIcon, ExternalLinkIcon } from 'lucide-react';

interface TransactionInfo {
  userOpHash: `0x${string}`;
  transactionUrl: string;
}

interface TransactionSentProps {
  transactionInfo: TransactionInfo | null;
  onClose: () => void;
}

const TransactionSent: React.FC<TransactionSentProps> = ({ transactionInfo, onClose }) => {
  if (!transactionInfo) return null;

  return (
    <div className="w-full p-4 bg-gray-100 rounded-md relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClose}
      >
        <XIcon className="h-4 w-4" />
      </Button>
      <h4 className="font-semibold mb-2">Transaction Sent</h4>
      <p className="text-sm mb-2">
        UserOp Hash: <span className="font-mono">{transactionInfo.userOpHash.slice(0, 6)}...{transactionInfo.userOpHash.slice(-4)}</span>
      </p>
      <a
        href={transactionInfo.transactionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline flex items-center"
      >
        View on Jiffyscan
        <ExternalLinkIcon className="ml-1 h-3 w-3" />
      </a>
    </div>
  );
};

export default TransactionSent;
