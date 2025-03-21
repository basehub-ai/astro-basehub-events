import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { basehub } from "basehub";
import { sendEvent } from "basehub/events";
// import { sendEvent } from "../.basehub/events";

export const server = {
  submitEmail: defineAction({
    accept: "form",
    input: z.object({
      email: z.string(),
    }),
    handler: async (input) => {
      const data = await basehub({
        token: import.meta.env.BASEHUB_TOKEN,
      }).query({
        waitlist: {
          input: {
            ingestKey: true,
          },
        },
      });

      const result = await sendEvent(data.waitlist.input.ingestKey, {
        email: input.email,
      });

      if (!result.success) {
        console.error(result);
        return "Error submitting email";
      }
      console.log({ data, input });

      return "Email submitted";
    },
  }),
};
