import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp } from 'lucide-react';
import { Transaction } from '../data/transactions';
import { getCurrentUser } from '../data/user';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const user = getCurrentUser();
  const isReceived = transaction.toNumber === user?.phoneNumber;
  const isSent = transaction.fromNumber === user?.phoneNumber;
  
  let icon = <ArrowUpRight size={20} />;
  let bgColor = 'bg-red-100';
  let iconColor = 'text-red-600';
  let amountPrefix = '-';
  let displayName = transaction.toName || transaction.toNumber;
  
  if (isReceived) {
    icon = <ArrowDownLeft size={20} />;
    bgColor = 'bg-green-100';
    iconColor = 'text-green-600';
    amountPrefix = '+';
    displayName = transaction.fromName || transaction.fromNumber;
  }
  
  if (transaction.type === 'deposit') {
    icon = <Wallet size={20} />;
    bgColor = 'bg-blue-100';
    iconColor = 'text-blue-600';
    amountPrefix = '+';
    displayName = 'Float Deposit';
  }
  
  if (transaction.type === 'withdraw') {
    icon = <Wallet size={20} />;
    bgColor = 'bg-orange-100';
    iconColor = 'text-orange-600';
    amountPrefix = '-';
    displayName = 'Float Withdrawal';
  }
  
  if (transaction.type === 'auto_sweep') {
    icon = <TrendingUp size={20} />;
    bgColor = 'bg-purple-100';
    iconColor = 'text-purple-600';
    amountPrefix = '-';
    displayName = 'Auto-Sweep';
  }

  const statusColor = 
    transaction.status === 'completed' ? 'text-green-600' : 
    transaction.status === 'pending' ? 'text-yellow-600' : 
    'text-red-600';

  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p style={{ fontWeight: 600 }}>{displayName}</p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className={`text-xs ${statusColor}`} style={{ fontWeight: 600 }}>
          {transaction.status.toUpperCase()}
        </p>
      </div>
      <div className="text-right">
        <p style={{ fontWeight: 700 }} className={isSent ? 'text-red-600' : 'text-green-600'}>
          {amountPrefix}{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">UGX</p>
      </div>
    </div>
  );
}