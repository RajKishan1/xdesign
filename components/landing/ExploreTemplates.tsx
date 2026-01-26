import { Item } from "@radix-ui/react-dropdown-menu";
import React from "react";
interface Props {
  imgUrl: string,
  title: string,
  text: string
}
const TemplateData = [
  {
    imgUrl: "/",
    title: "Smart Upload",
    text: ""
  },
  {
    imgUrl: "/",
    title: "Smart Upload",
    text: ""
  }, {
    imgUrl: "/",
    title: "Smart Upload",
    text: ""
  }, {
    imgUrl: "/",
    title: "Smart Upload",
    text: ""
  }, {
    imgUrl: "/",
    title: "Smart Upload",
    text: ""
  },
]

export const TemplateCards = ({ imgUrl, title, text }: Props) => {
  return <div className="w-96 h-129 bg-zinc-50">
    <img src={imgUrl} alt="" />
    <h2>{title}</h2>
    <p>{text}</p>
  </div>;
};

const ExploreTemplates = () => {
  return (
    <section>
      <div className="flex flex-col mx-auto  items-center">
        <h1 className="text-[40px] text-center">Explore Templates</h1>
        <p>Customise beautiful pre-built design Templates</p>
      </div>
      <div className="flex block">
        {TemplateData.map((item, index) => (
          <TemplateCards
            key={index}
            imgUrl={item.imgUrl}
            title={item.title}
            text={item.text}
          />
        )
        )}
      </div>
    </section>
  );
};

export default ExploreTemplates;
