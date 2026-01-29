import React from "react";
const testimonials = [
  {
    id: 1,
    quote:
      "We went from a rough idea to a full product design using just one prompt. Screens, flows, everything — done in minutes.",
    author: {
      name: "Rahul Mehta",
      role: "Product Manager",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
  },
  {
    id: 2,
    quote:
      "Gimble generates clean, consistent layouts that actually make sense. Huge time saver for early-stage products.",
    author: {
      name: "Ananya Verma",
      role: "Startup Founder",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
  },
  {
    id: 3,
    quote:
      "I just describe what I want, and Gimble gives me complete UI flows ready to build.",
    author: {
      name: "Arjun Patel",
      role: "Frontend developer",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
  },
  {
    id: 4,
    quote:
      "Gimble helps us visualize the entire product before writing a single line of code Gimble helps us visualize the entire product.",
    author: {
      name: "Sneha Kapoor",
      role: "UX Lead",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
  },
  {
    id: 5,
    quote:
      "It's fast, intuitive, and surprisingly accurate for end-to-end design generation.",
    author: {
      name: "Kunal Sharma",
      role: "Indie Hacker",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    },
  },
  {
    id: 6,
    quote:
      "Instead of designing screen by screen, we now generate complete user journeys instantly.",
    author: {
      name: "Sneha joshi",
      role: "Operations & Product",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    },
  },
];

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

const UserCard: React.FC<TestimonialCardProps> = ({ quote, author }) => {
  return (
    <div className="w-full min-h-75 flex flex-col justify-between border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-950 dark:bg-black sm:p-8">
      {/* Quote */}
      <p className="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:mb-12 sm:text-lg">
        {quote}
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          src={author.avatar}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
        />

        {/* Name and Role */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            {author.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {author.role}
          </p>
        </div>
      </div>
    </div>
  );
};

const UsersFeedback = () => {
  return (
    <section className="">
      <div className="flex flex-col items-center mb-19">
        {" "}
        <div className="mb-4 rounded-full p-2">Users Feedback</div>
        <h1 className="font-semibold text-[40px]">Hear from our Users</h1>
        <p className="text-center"> 
          See authentic feedback and testimonials highlighting <br/> how our work
          delivered value & met client.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 py-10 px-4">
        {testimonials.map((testimonial) => (
          <UserCard
            key={testimonial.id}
            quote={testimonial.quote}
            author={testimonial.author}
          />
        ))}
      </div>
    </section>
  );
};

export default UsersFeedback;
