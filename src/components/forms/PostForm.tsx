// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import FileUploader from "../shared/FileUploader";
// import { PostValidation } from "@/lib/validation";
// import { Models } from "appwrite";
// import { useUserContext } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import { useCreatePost } from "@/lib/react-query/queriesAndMutations";

// type PostFormProps = {
//   post?: Models.Document;
// };

// const Postform = ({ post }: PostFormProps) => {
//   const { mutateAsync: createPost, isPending: isLoadingCreate } =
//     useCreatePost();
//   const { user } = useUserContext();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const form = useForm<z.infer<typeof PostValidation>>({
//     resolver: zodResolver(PostValidation),
//     defaultValues: {
//       caption: post ? post?.caption : "",
//       file: [],
//       location: post ? post?.location : "",
//       tags: post ? post?.tags.join(",") : "",
//     },
//   });

//   // 2. Define a submit handler.
//   async function onSubmit(values: z.infer<typeof PostValidation>) {
//     const newPost = await createPost({
//       ...values,
//       userId: user.id,
//     });

//     if (!newPost) {
//       toast({
//         title: "Failed to create post. Please try again.",
//       });
//     }

//     navigate("/");
//   }
//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col gap-9 w-full max-w-5xl"
//       >
//         <FormField
//           control={form.control}
//           name="caption"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Caption</FormLabel>
//               <FormControl>
//                 <Textarea
//                   className="shad-textarea custom-scrollbar"
//                   placeholder="Enter a caption"
//                   {...field}
//                 />
//               </FormControl>

//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="file"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Add Photos</FormLabel>
//               <FormControl>
//                 <FileUploader
//                   fieldChange={field.onChange}
//                   mediaUrl={post?.imageURL}
//                 />
//               </FormControl>

//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="location"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">Add Location</FormLabel>
//               <FormControl>
//                 <Input type="text" className="shad-input" {...field} />
//               </FormControl>

//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="tags"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="shad-form_label">
//                 Add Tags (seperated by comma " , ")
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   type="text"
//                   className="shad-input"
//                   placeholder="Art,Expression, Learn"
//                   {...field}
//                 />
//               </FormControl>

//               <FormMessage className="shad-form_message" />
//             </FormItem>
//           )}
//         />
//         <div className="flex gap-4 items-center justify-end">
//           <Button type="button" className="shad-button_dark_4">
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="shad-button_primary whitespace-nowrap"
//           >
//             Submit
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default Postform;


import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
     Form,
     FormControl,
     FormField,
     FormItem,
    FormLabel,
     FormMessage,
   } from "@/components/ui/form";
import { PostValidation } from "@/lib/validation";

import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { useCreatePost, useUpdatePost  } from "@/lib/react-query/queriesAndMutations";
import { Textarea } from "../ui/textarea";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
      imageURL: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.ImageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate }>
            {(isLoadingCreate || isLoadingUpdate ) && 
            <>
             <p>Loading...</p>
             <Loader /> 
             </>}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;