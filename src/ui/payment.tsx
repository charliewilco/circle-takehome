import type { Payment } from "../lib/payments";

export const PaymentRow = (props: Payment) => {
  const date = new Date(props.date).toDateString();
  return (
    <tr>
      <td>{date}</td>
      <td>{props.amount}</td>
      <td>{props.currency}</td>
      <td>{props.sender.name}</td>
      <td>{props.receiver.name}</td>
      <td>{props.memo}</td>
    </tr>
  );
};

export const PaymentTable = (props: { payments: Payment[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>date</th>
          <th>amount</th>
          <th>currency</th>
          <th>sender</th>
          <th>receiver</th>
          <th>memo</th>
        </tr>
      </thead>
      <tbody>
        {props.payments.map((p) => {
          const date = new Date(p.date).toDateString();
          return (
            <tr key={p.id}>
              <td>{date}</td>
              <td>{p.amount}</td>
              <td>{p.currency}</td>
              <td>{p.sender.name}</td>
              <td>{p.receiver.name}</td>
              <td>{p.memo}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
