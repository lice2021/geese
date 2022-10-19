import copy from 'copy-to-clipboard';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineStar,
} from 'react-icons/ai';
import { GoLink, GoLinkExternal } from 'react-icons/go';

import {
  cancelCollectRepo,
  cancelVoteRepo,
  collectRepo,
  recordGoGithub,
  userRepoStatus,
  voteRepo,
} from '@/services/repository';
import { numFormat } from '@/utils/util';

import message from '../message';

import { Repository } from '@/types/reppsitory';

interface Props {
  repo: Repository;
}

const ButtonGroup: NextPage<Props> = ({ repo }) => {
  const commonStyle =
    'flex flex-1 items-center justify-center cursor-pointer leading-10 hover:text-current md:hover:text-blue-500 active:!text-gray-400';
  const iconStyle = 'mr-1';

  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [likesTotal, setLikesTotal] = useState<number>(0);
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [collectTotal, setCollectTotal] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const onClickLink = (rid: string) => {
    // 调用接口记录链接点击信息
    checkMobile();
    recordGoGithub(rid);
  };

  const checkMobile = () => {
    if (
      navigator.userAgent.match(/Mobi/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      setIsMobile(true);
    }
  };

  const getUserRepoStatus = async (rid: string) => {
    // 调用接口查看项目是否点赞
    const data = await userRepoStatus(rid);
    setIsVoted(data.is_voted);
    setIsCollected(data.is_collected);
  };

  const onClickVote = async (rid: string) => {
    const data = await voteRepo(rid);
    if (data?.data) {
      setLikesTotal(data.data.total);
      setIsVoted(true);
    }
  };

  const onClickCollect = async (rid: string) => {
    const data = await collectRepo(rid);
    if (data?.data) {
      setCollectTotal(data.data.total);
      setIsCollected(true);
    }
  };

  const onCancelVote = async (rid: string) => {
    const data = await cancelVoteRepo(rid);
    if (data?.success) {
      setIsVoted(false);
      setLikesTotal(likesTotal - 1);
    }
  };

  const onCancelCollect = async (rid: string) => {
    const data = await cancelCollectRepo(rid);
    if (data?.success) {
      setIsCollected(false);
      setCollectTotal(likesTotal - 1);
    }
  };

  const handleCopy = (repo: Repository) => {
    const text = `${
      repo.name
    }：${repo.title.trim()}。\n点击查看详情：https://hellogithub.com/repository/${
      repo.rid
    }`;
    if (copy(text)) {
      message.success('项目信息已复制，快去分享吧！');
    } else message.error('复制失败');
  };

  useEffect(() => {
    getUserRepoStatus(repo.rid);
    setLikesTotal(repo.likes);
    setCollectTotal(repo.collect_total);
  }, [repo]);

  return (
    <div className='flex border-t border-solid bg-white text-center text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 md:rounded-b-lg'>
      {isVoted ? (
        <div className={commonStyle} onClick={() => onCancelVote(repo.rid)}>
          <AiFillHeart className='mr-1 text-blue-500' size={14} />
          <span className='text-xs text-inherit text-blue-500'>
            {numFormat(likesTotal, 1)}
          </span>
        </div>
      ) : (
        <div className={commonStyle} onClick={() => onClickVote(repo.rid)}>
          <AiOutlineHeart className={iconStyle} size={14} />
          点赞
        </div>
      )}

      {isCollected ? (
        <div className={commonStyle} onClick={() => onCancelCollect(repo.rid)}>
          <AiFillStar className='mr-1 text-blue-500' size={14} />
          <span className='text-xs text-inherit text-blue-500'>
            {numFormat(collectTotal, 1)}
          </span>
        </div>
      ) : (
        <div className={commonStyle} onClick={() => onClickCollect(repo.rid)}>
          <AiOutlineStar className={iconStyle} size={14} />
          收藏
        </div>
      )}

      <div className={commonStyle} onClick={() => handleCopy(repo)}>
        <GoLinkExternal className={iconStyle} size={14} />
        分享
      </div>
      <Link href={repo.url}>
        <a
          target={isMobile ? '_self' : '_blank'}
          className={commonStyle}
          onClick={() => onClickLink(repo.rid)}
        >
          <GoLink className={iconStyle} size={14} />
          访问
        </a>
      </Link>
    </div>
  );
};

export default ButtonGroup;
