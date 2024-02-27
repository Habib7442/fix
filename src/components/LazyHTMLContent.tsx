import React, { useEffect, useState } from "react";

interface Props {
  content: any;
  time: number;
}

const LazyHTMLContent = React.memo(({ content, time }: Props) => {
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, time));
      setRenderedContent(content);
    };

    fetchData();
  }, [content, time]);

  return (
    <div
      className="w-full flex flex-col justify-center items-center text-black/80 mt-4"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
});
LazyHTMLContent.displayName = "LazyHTMLContent";
export default LazyHTMLContent;
