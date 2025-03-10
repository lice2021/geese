import Link from 'next/link';
import { GoThumbsup } from 'react-icons/go';

import { useLoginContext } from '@/hooks/useLoginContext';

import Message from '@/components/message';
import Rating from '@/components/respository/Rating';

import { like, unlike } from '@/services/repository';
import { DEFAULT_AVATAR, NOOP } from '@/utils/constants';
import { fromNow } from '@/utils/day';

import MDRender from '../mdRender/MDRender';

import { CommentItemData } from '@/types/reppsitory';

const CommentItem = (
  props: CommentItemData & {
    className?: string;
    /** 是否独自显示，以表示当前用户所发表过的评论 */
    alone?: boolean;
    footerRight?: (data: CommentItemData) => React.ReactNode;
    onChangeVote?: (value: boolean) => void;
  }
) => {
  const {
    cid,
    user,
    score,
    comment,
    votes,
    belong,
    belong_id: belongId,
    is_used: isUsed,
    created_at: createdAt,
    is_voted: isVoted,
    is_show: isShow,
    alone,
    className,
    onChangeVote = NOOP,
  } = props;
  const { isLogin } = useLoginContext();

  const handleVote = async () => {
    if (isVoted) {
      await unlike({ belong, belongId, cid });
      onChangeVote(false);
    } else if (isLogin) {
      await like({ belong, belongId, cid });
      onChangeVote(true);
    } else {
      Message.error('请先登录！');
    }
  };

  const footerRight =
    props.footerRight ||
    (() =>
      alone ? (
        <span className='ml-auto text-sm text-gray-400'>
          {isShow ? '已精选' : '未精选'}
        </span>
      ) : (
        <div
          className={`flex cursor-pointer items-center leading-10 text-gray-400 hover:text-gray-900 active:text-gray-400 ${
            isVoted ? '!text-blue-500' : ''
          }`}
          onClick={handleVote}
        >
          <GoThumbsup className='mr-1' size={14} />
          <span className='text-sm'>{votes || '点赞'}</span>
        </div>
      ));

  return (
    <div className={`flex ${className} truncate`}>
      <div className='mr-4 hidden md:block'>
        <div className='relative h-14 w-14'>
          <Link href={`/user/${user.uid}`}>
            <a>
              <img
                className='cursor-pointer rounded-full'
                src={user?.avatar || DEFAULT_AVATAR}
                alt='comment_avatar'
              />
            </a>
          </Link>
        </div>
      </div>
      <div className='w-max-full relative flex-1'>
        <div className='flex items-center gap-4'>
          <span className='flex w-px max-w-fit flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold md:text-base md:font-normal'>
            <span className='mr-1 h-5 md:hidden'>
              <img
                className='h-5 w-5 rounded-full'
                width='20'
                height='20'
                src={user?.avatar || DEFAULT_AVATAR}
                alt='comment_avatar'
              />
            </span>
            <Link href={`/user/${user.uid}`}>
              <a>{user?.nickname}</a>
            </Link>
          </span>
          <span className='flex shrink-0 items-center text-xs md:text-sm'>
            评分：
            <Rating value={score} />
          </span>
          <span className='shrink-0 text-xs md:text-sm'>
            {isUsed ? '用过' : '没用过'}
          </span>
        </div>
        <div className='mt-2 whitespace-normal break-all text-sm text-gray-900 dark:text-gray-200'>
          <MDRender>{comment}</MDRender>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-sm text-gray-400'>{fromNow(createdAt)}</span>
          {footerRight(props)}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
