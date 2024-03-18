Thx for applying to our startup. We are looking to hire our first engineer asap so let's get things in motion. We've received around one thousand applicants, so if our CTO (me) was to interview all of them assuming 30 minutes per interview, it would take around 20 days straight of interviewing with the assumption I don't eat or sleep for those 20 days. Since we need to move faster than that, I've built a take home challenge designed to weed out 99% of applicants. Anyone who passes the challenge gets an interview with me. If all goes to plan, I expect only around 10 of you to pass and get an interview.


Here is the take home challenge:
Write the few lines of code needed to ensure a continuous stream of timestamps are logged, even when the tab is not visible. 

What we measure with this take home challenge:
This question is designed to only measure your resourcefulness as an engineer. Being an expert on chrome extensions, javascript, or browsers doesn't help at all. I know this with a high degree of certainty because most big chrome extension companies don't know how to do this, and they have teams of chrome extension engineers with 10+ years experience. What their engineers all lack is resourcefulness, not experience. Our CTO was only able to figure this out because he was more resourceful than the engineers working at big chrome extension companies. In fact, the solution to this challenge is so precious that four large chrome extension companies paid us $5k each for these few lines of code.

More details:
When injecting javascript code into a webpage via a chrome extension or otherwise, a common use case is to continue performing actions on the webpage even while the user does not have that tab active. Unfortunately, most websites check if the tab is active using very sophisticated methods. Switching tabs, minimizing/closing the browser, or moving the browser off screen, all trigger the tab to become inactive. When a tab is inactive, web pages usually throttle most javascript code execution. The goal here is to circumvent this limitation, and we’ve made it easy to test your solutions with the sample code in the challenge. You only need to write a few lines of code to pass the challenge.

Rules:
There are only two rules. 
1) No DOM manipulation allowed such as overriding document.visibilityState.
2) You can only change the code in one file: background.js. When testing your code, we will use the original challenge code and only add in your updated background.js file.

Submission:
Please reply to this only with your updated background.js file.

Video guide: 
Please watch the video I made describing the challenge. It highlights an easy way to test if your solution works. https://vimeo.com/923628666

Here is the job posting in case you lost it:
https://www.linkedin.com/jobs/view/3851136104

Here is the code for the challenge:
You are given a simple chrome extension that injects javascript into a webpage and makes it easy to test your solution. https://drive.google.com/drive/folders/1HMuMAYHHAQ2klsqUVQpTDGFUGXQCoePZ

Use this webpage for easy testing:
https://ai-stealth-challenge.web.app

If you have questions please figure them out on your own as that is part of the challenge. Good luck, and I hope to hear from you soon :)