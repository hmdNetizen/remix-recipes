import { Header } from "./header";

type PageDescriptionProps = {
  header: string;
  message: string;
};

export const PageDescription = ({ header, message }: PageDescriptionProps) => {
  return (
    <div>
      <Header>{header}</Header>
      <p className="text-red-500">{message}</p>
    </div>
  );
};
