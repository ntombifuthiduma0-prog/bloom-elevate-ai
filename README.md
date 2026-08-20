# Bloom & Elevate AI

Bloom & Elevate AI Business Assistant — Full Application Specification

Build a polished, modern, responsive web application called Bloom & Elevate AI Business Assistant.

This is ONE integrated AI productivity application for a small events/business brand called Bloom & Elevate.

The application must demonstrate:

Practical AI implementation

Strong prompt engineering

Real-world business problem solving

Responsible AI usage

Modern user interface design

Responsive design

Clear AI input and output

Professional user experience

1. CORE APPLICATION STRUCTURE

Create a dashboard-based application with:

A professional sidebar navigation

A main dashboard

Responsive desktop, tablet and mobile layouts

Modern cards and clean typography

Clear input and output sections

Loading states while AI processes requests

Error states and helpful validation messages

Empty states where appropriate

Consistent Bloom & Elevate branding throughout

Sidebar navigation:

Dashboard

Smart Email Generator

AI Task Planner

AI Assistant

Responsible AI

The three AI features must be integrated into ONE application rather than functioning as three unrelated projects.

2. DASHBOARD

Create a welcoming dashboard titled:

Bloom & Elevate AI

Subtitle:

Your intelligent business assistant for smarter communication, planning and productivity.

Include:

Welcome section

Quick-access cards for the three AI features

Upcoming event overview

Today's priority tasks

Recent AI activity

Short responsible-AI notice

Quick actions:

✉️ Create an Email
Generate a professional, friendly client email.

📅 Plan My Day
Create and prioritise tasks around Bloom & Elevate events.

💬 Ask Bloom & Elevate AI
Interact with the AI assistant using natural language.

3. FEATURE ONE — SMART EMAIL GENERATOR

Create a dedicated Smart Email Generator page.

Purpose:

Generate professional, warm and friendly emails for Bloom & Elevate clients.

The communication style must be:

Professional

Warm

Friendly

Clear

Concise

Young-client-friendly

Approachable

Not overly corporate

Natural and human

Positive without sounding artificial

Input fields:

Email purpose

Client name (optional)

Client situation/context

Important details

Desired outcome

Tone selector

Tone options:

Friendly

Professional

Warm

Follow-up

Empathetic

Thank-you

Reminder

Include a prominent:

Generate Email

button.

The output should display:

Subject line

Greeting

Email body

Professional closing

Include buttons for:

Copy

Regenerate

Edit

Clear

The AI must NOT automatically send emails.

Display a human-review notice:

Review AI-generated content before sending it to a client.

EMAIL AI PROMPTING REQUIREMENTS

Use strong prompt engineering.

The AI should be instructed to:

Understand the user's context.

Identify the purpose of the email.

Maintain Bloom & Elevate's communication style.

Adapt the tone to the selected option.

Keep the language natural and easy to understand.

Avoid unnecessary jargon.

Never invent client information.

Never invent bookings, dates, prices or business policies.

Ask for clarification when critical information is missing.

Produce a complete draft that the user can review and edit.

4. FEATURE TWO — AI TASK PLANNER

Create an AI-powered task planning page.

Purpose:

Help Bloom & Elevate organise and prioritise daily work, especially around event-hosting days.

Bloom & Elevate's primary event-hosting days are:

Friday

Saturday

Sunday

Public holidays

The planner should allow the user to enter:

Event date

Event type

Event start time

Event end time

Tasks

Deadlines

Number of events

Additional notes

Allow users to add multiple tasks.

Each task should have:

Task name

Deadline

Estimated duration

Priority

Status

The AI should automatically:

Analyse the tasks

Identify urgent tasks

Prioritise tasks

Group related tasks

Consider event dates

Consider deadlines

Consider estimated duration

Create a realistic daily schedule

Highlight tasks that should be completed before an event

Identify potential scheduling conflicts

Priority levels:

🔴 High
🟡 Medium
🟢 Low

The AI should create a schedule with time blocks.

Example:

08:00 — Confirm supplier — HIGH
09:00 — Prepare event materials — HIGH
11:00 — Client communication — MEDIUM
14:00 — Social media preparation — LOW

Include:

Generate Schedule

Regenerate

Edit

Mark Complete

Clear

The planner must prioritise tasks intelligently rather than simply sorting them alphabetically.

5. FEATURE THREE — AI CHATBOT

Create an interactive AI assistant called:

Bloom & Elevate AI Assistant

The chatbot should allow users to communicate naturally with the AI.

Users can ask questions such as:

"Help me plan for Saturday's event."

"Write an email to a client who has not confirmed their booking."

"What should I prioritise today?"

"Create a follow-up email for a client."

"What tasks should I complete before tomorrow's event?"

The chatbot should identify which Bloom & Elevate function is relevant and provide a useful response.

Where appropriate, the chatbot should guide the user toward the Email Generator or Task Planner.

Example:

User:
"I need to remind a client about their booking."

Assistant:
"I can help with that. Would you like me to create a friendly client reminder email?"

Provide:

Chat history

User messages

AI responses

Clear chat

Loading indicator

Error handling

Suggested prompts

Suggested prompts:

"Plan my day"

"Write a client email"

"Help me prepare for an event"

"What should I prioritise?"

6. INTEGRATION BETWEEN FEATURES

These features must work together as ONE application.

For example:

A user can ask the AI Assistant:

"I have an event on Saturday. Help me prepare."

The assistant should be able to suggest using the Task Planner.

Another example:

"I need to remind my client about Saturday's event."

The assistant should be able to direct the user to the Smart Email Generator.

The dashboard should provide quick access to both tools.

The experience should feel like one unified Bloom & Elevate AI platform.

7. RESPONSIBLE AI

Create a dedicated Responsible AI section.

Include clear information about:

AI-generated content

Human oversight

Accuracy

Privacy

Confidentiality

Potential AI errors

Responsible use

The application must never claim that AI outputs are guaranteed to be correct.

Include this disclaimer visibly in the application:

"Responsible AI Notice: Bloom & Elevate AI provides AI-generated suggestions and content. Always review AI-generated outputs for accuracy, appropriateness and confidentiality before using them for client communication or business decisions."

The system should:

Avoid inventing facts

Avoid fabricating client information

Avoid automatically sending communications

Encourage human review

Minimise unnecessary personal information

Clearly indicate when content is AI-generated

8. MODERN UI / UX

Design the interface to feel:

Modern

Elegant

Professional

Youthful

Friendly

Premium

Easy to navigate

Use a clean dashboard layout with:

Sidebar

Top navigation/header

Cards

Buttons

Forms

Status badges

Priority indicators

AI chat interface

Clear typography

Consistent spacing

Subtle animations where appropriate

Do NOT make the interface look like a generic developer dashboard.

The visual identity should feel appropriate for a modern events and lifestyle brand.

Use the Bloom & Elevate name consistently.

9. RESPONSIVE DESIGN

The application must be fully responsive.

Desktop:

Persistent sidebar

Spacious dashboard layout

Tablet:

Adaptive layout

Mobile:

Collapsible navigation

Stacked cards

Mobile-friendly forms

Mobile-friendly chatbot

Touch-friendly buttons

Ensure there is no horizontal scrolling on mobile.

10. AI EXPERIENCE

All AI interactions should have:

Clear input

Clear output

Loading state

Error state

Regenerate option where appropriate

Ability to edit generated content

Ability to copy generated content

Never leave the user wondering whether the AI is processing their request.

11. DATA AND SECURITY

Do not expose API keys or secrets in frontend code.

Use secure environment variables for AI/API credentials.

Do not store sensitive client information unnecessarily.

If a backend/database is required, use appropriate secure storage and access controls.

12. PROJECT QUALITY

The final application should feel like a functional MVP that could realistically be used by Bloom & Elevate.

Prioritise functionality and usability over unnecessary features.

Make sure every navigation item works.

Do not create placeholder buttons that do nothing.

Do not create fake AI responses presented as real AI.

Where an AI API integration is required, structure the application so the AI service can be connected securely.

13. ASSESSMENT ALIGNMENT

The final application must clearly demonstrate:

Practical AI Implementation

AI performs meaningful business tasks.

Prompt Engineering

AI behaviour is controlled through structured, context-aware prompts.

Real-World Problem Solving

The application solves communication, planning and productivity problems for Bloom & Elevate.

Responsible AI

The application includes human oversight, privacy considerations and a visible responsible-AI disclaimer.

Modern UI Design

The application has a professional dashboard, sidebar, responsive design and clear input/output sections.

14. FINAL EXPERIENCE

The user journey should be:

Dashboard
↓
Choose AI capability
↓
Enter information
↓
AI processes the request
↓
Receive useful output
↓
Review/edit output
↓
Copy/use the result

Build this as a cohesive, polished Bloom & Elevate AI Business Assistant, not three separate applications.

Before considering the build complete, check every requirement above and ensure the application is functional, responsive and visually professional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb3468a8-4337-4441-b485-8160f01b8171).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
