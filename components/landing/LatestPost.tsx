"use client";
import React from "react";

const LatestPost = () => {
  const [isDark, setIsDark] = React.useState(false);

  const posts = [
    {
      id: 1,
      title: "How Gimble Turns a Single Prompt into a Full Product Design",
      category: "Productivity",
      date: "Sep 5, 2025",
      linear: "from-gray-200 via-teal-100 to-gray-900",
      darklinear: "from-gray-800 via-teal-900 to-zinc-950",
    },
    {
      id: 2,
      title: "Maximizing productivity while streamlining content workflows",
      category: "Productivity",
      date: "Sep 5, 2025",
      linear: "from-orange-400 via-purple-500 to-cyan-400",
      darklinear: "from-orange-600 via-purple-700 to-cyan-600",
    },
    {
      id: 3,
      title: "How bloopix makes managing digital content easier and smarter",
      category: "Database",
      date: "Sep 18, 2025",
      linear: "from-yellow-300 via-pink-300 to-cyan-300",
      darklinear: "from-yellow-600 via-pink-600 to-cyan-600",
    },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950 sm:px-6 lg:px-8">
       

        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            {/* Top Badge */}
            <div className="mb-6 flex items-center justify-center gap-2">
            
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Latest posts
              </span>
            
            </div>

            {/* Main Heading */}
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Explore recent insights
            </h2>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Discover the latest updates, creative strategies, and design ideas
              shared through our blog posts
            </p>

          
          </div>

          {/* Blog Cards Grid */}
          <div className="grid  md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer overflow-hidden rounded-none bg-white shadow-sm transition-all hover:shadow-xl dark:bg-gray-900"
              >
                {/* Image/linear Area */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${
                      isDark ? post.darklinear : post.linear
                    } opacity-90 blur-2xl transition-transform duration-500 group-hover:scale-110`}
                  ></div>
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${
                      isDark ? post.darklinear : post.linear
                    } transition-transform duration-500 group-hover:scale-105`}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-4 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
                    {post.title}
                  </h3>

                  {/* Meta Information */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPost;
