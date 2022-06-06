/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';

const ReadMore = (props) => {
  const { text, limit } = props;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div className="break-all">
      {text.length > Number(limit) ? (
        <>
          {isReadMore ? text.slice(0, Number(limit)) : text}
          <div onClick={toggleReadMore} className="text-12 text-blue cursor-pointer">
            {isReadMore ? '...read more' : ' show less'}
          </div>
        </>
      ) : (
        text
      )}
    </div>
  );
};

export default ReadMore;
