"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import axios from "axios";
import moment from "moment";

const IssuesPage = () => {
  const [issueExist, setIssueExist] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/issues").then((response) => {
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
    <div>
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
      {issueExist &&
        issues.map((issue) => {
          return (
            <Card className="mt-5" style={{ maxWidth: 240 }} key={issue.id}>
              <Link
                href={{
                  pathname: "/issues/[id]",
                  query: { id: issue?.id },
                }}
                as={`issues/${issue?.id}`}
              >
                <Flex gap="3" align="center">
                  <Box>
                    <Text as="div" size="4">
                      {issue.title}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      #{issue.id} opened{" "}
                      {moment
                        .utc(issue.createdAt)
                        .local()
                        .startOf("seconds")
                        .fromNow()}{" "}
                      by -{" "}
                    </Text>
                  </Box>
                </Flex>
              </Link>
            </Card>
          );
        })}
    </div>
  );
};

export default IssuesPage;
