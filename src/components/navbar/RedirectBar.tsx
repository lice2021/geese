interface Props {
  text?: string;
}

const RedirectBar = ({ text = '跳转中...' }: Props) => {
  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-300 md:rounded-lg'>
      <div className='m-2'>
        <div className='flex py-2.5 pl-4 pr-3'>{text}</div>
      </div>
    </div>
  );
};

export default RedirectBar;
