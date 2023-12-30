"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { editIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

type IssueForm = z.infer<typeof editIssueSchema>;

const NewIssuePage = ({ params }: { params: any }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(editIssueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const [issueExist, setIssueExist] = useState(false);
  const [issues, setIssues] = useState<any>([]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.title == "" && data.description == undefined) {
      data = {
        title: issues.title,
        description: issues.description,
      };
    } else if (data.title == "") {
      data = {
        title: issues.title,
        description: data.description,
      };
    } else if (data.description == undefined) {
      data = {
        title: data.title,
        description: issues.description,
      };
    }
    try {
      setSubmitting(true);
      await axios.patch("/api/issues", data, { params: { id: params.id } });
      router.push("/issues");
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occured.");
    }
  });

  const onDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete("/api/issues", { params: { id: params.id } });
      router.push("/issues");
    } catch (error) {
      setDeleting(false);
      setError("An unexpected error occured.");
    }
  };

  useEffect(() => {
    axios
      .get(`/api/issues/`, { params: { id: params.id } })
      .then((response) => {
        try {
          if (response.data !== null) {
            setIssueExist(true);
            setIssues(response.data);
          } else {
            setIssueExist(false);
          }
        } catch (error) {
          setIssueExist(false);
          console.error(error);
        }
      });
  }, []);

  return (
    <>
      <div className="max-w-xl">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <form className="space-y-3" onSubmit={onSubmit}>
          <TextField.Root>
            <TextField.Input
              defaultValue={issues.title}
              {...register("title")}
            />
          </TextField.Root>
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SimpleMDE value={issues.description} onChange={onChange} />
            )}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
          <Button disabled={isSubmitting}>
            Submit New Issue {isSubmitting && <Spinner />}
          </Button>
        </form>
      </div>
      <div>
        <Button onClick={onDelete}>
          Delete Issue {isDeleting && <Spinner />}
        </Button>
      </div>
    </>
  );
};

export default NewIssuePage;
