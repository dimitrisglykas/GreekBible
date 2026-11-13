# Lumina Script

PROJECT: Greek Bible — A Modern Way to Meet Jesus



Build a production-quality, modern Greek Christian web application whose mission is:



To help people, especially teenagers and young adults, discover the Bible, understand it, encounter Jesus Christ, and grow closer to God.



This is NOT intended to be a traditional church website.



It should feel like a beautiful, modern digital product that a 16–25-year-old would actually enjoy using.



The core journey is:



Ανακάλυψε → Διάβασε → Ρώτησε → Κατανόησε → Σκέψου → Προσευχήσου → Πλησίασε τον Χριστό



The entire user interface must be in natural, modern Greek.



---



BRAND / PRODUCT FEEL



The product should feel:



- Modern

- Peaceful

- Beautiful

- Youthful

- Christ-centered

- Welcoming

- Authentic

- Simple

- Emotionally warm

- Never judgmental

- Never boring



Avoid the visual style of:



- Old church websites

- Religious organizations from the early 2000s

- Cluttered Bible websites

- Generic SaaS dashboards

- Excessive gold crosses

- Cheesy Christian stock photography



Think:



modern reading app + thoughtful educational platform + peaceful spiritual experience



while maintaining a clear Christian identity.



---



CORE BRAND MESSAGE



Primary phrase:



Γνώρισε τον Λόγο. Γνώρισε τον Χριστό.



Supporting message:



Η Αγία Γραφή, πιο κοντά σου από ποτέ. Διάβασε, αναζήτησε, ρώτησε και ανακάλυψε τι σημαίνει ο Λόγος του Θεού για τη ζωή σου σήμερα.



The website should make people curious about Scripture rather than pressure them into Christianity.



---



TARGET AUDIENCE



Primary:



- Teenagers

- University students

- Young adults

- Young Christians

- People curious about Christianity

- People who have never read the Bible

- People who think the Bible is difficult

- People who want answers about God

- People experiencing difficult moments

- People who want to know who Jesus is



The product must also work for someone who opens it and knows almost nothing about Christianity.



Never assume the user already understands:



- Biblical terminology

- Church terminology

- Theology

- Bible structure

- Christian traditions



Explain things simply.



---



PRIMARY NAVIGATION



Desktop navigation:



Αρχική

Βίβλος

Αναζήτηση

Σήμερα

Ανακάλυψε

Προφίλ



Prominent CTA:



💬 Ρώτα τον Βοηθό



Mobile bottom navigation:



Αρχική | Βίβλος | Αναζήτηση | Σήμερα | Προφίλ



Keep the AI assistant accessible from everywhere.



---



HOMEPAGE



Create an exceptional homepage.



Hero



Headline:



Γνώρισε τον Λόγο. Γνώρισε τον Χριστό.



Description:



Η Αγία Γραφή, πιο κοντά σου από ποτέ. Διάβασε, αναζήτησε, ρώτησε και ανακάλυψε τι μπορεί να σημαίνει ο Λόγος του Θεού για τη ζωή σου.



Primary button:



Ξεκίνα να διαβάζεις



Secondary button:



Δεν ξέρω από πού να ξεκινήσω



Hero imagery should use subtle natural Christian symbolism:



- Morning light

- Open Bible

- Mountains

- Olive branches

- Sky

- Light through clouds



Avoid cliché imagery.



---



CONTINUE READING



If the user has reading history, show:



Συνέχισε από εκεί που σταμάτησες



Example:



Κατά Ιωάννην 3



65% ολοκληρωμένο



Button:



Συνέχισε →



If there is no history:



Δεν έχεις ξεκινήσει ακόμα.



Button:



Ξεκίνα με το Ευαγγέλιο του Ιωάννη



---



DAILY EXPERIENCE



Create:



Στίχος της Ημέρας



Show:



- Bible verse

- Reference

- Short reflection

- Save

- Share

- Copy

- Read context



Below:



Μια σκέψη για σήμερα



Short, warm reflection.



Avoid making every reflection sound like a sermon.



---



COMPLETE BIBLE EXPERIENCE



The Bible is the central feature.



Structure:



Παλαιά Διαθήκη



- Γένεσις

- Έξοδος

- Λευιτικόν

- Αριθμοί

- Δευτερονόμιο

- etc.



Καινή Διαθήκη



- Κατά Ματθαίον

- Κατά Μάρκον

- Κατά Λουκάν

- Κατά Ιωάννην

- Πράξεις

- Επιστολές

- Αποκάλυψη



Build the Bible architecture so the complete Greek Bible can be connected through structured data.



DO NOT hardcode the entire Bible into individual UI components.



Use a data structure:



Bible

→ Books

→ Chapters

→ Verses



Each verse needs a unique ID.



Example:



book_id

chapter

verse

text



The system must make it easy to connect a legitimate Greek Bible dataset later.



---



BIBLE READER



Create a beautiful distraction-free Bible reader.



Features:



- Book selector

- Chapter selector

- Previous/next chapter

- Search

- Font size controls

- Dark mode

- Reading progress

- Bookmark

- Highlight

- Notes

- Copy

- Share

- Ask AI about this verse



Bible text should be the primary visual focus.



Avoid excessive UI around Scripture.



---



VERSE INTERACTIONS



When a user clicks/taps a verse, show:



Αποθήκευση

Επισήμανση

Σημείωση

Αντιγραφή

Κοινοποίηση

Ρώτησε τον Βοηθό



The final option must pass the selected verse/context into the Botpress assistant when the integration is connected.



---



SEARCH



Create a powerful Bible search.



Search bar:



Τι ψάχνεις στη Βίβλο;



Examples:



αγάπη



πίστη



Ιωάννης 3:16



συγχώρεση



όταν φοβάμαι



τι λέει η Βίβλος για την αγάπη;



Results should show:



- Verse

- Reference

- Context

- Open passage

- Ask AI



Design search as a major product feature.



---



DISCOVERY



Create:



Η Βίβλος για τη ζωή σου



Topics:



- ❤️ Αγάπη

- 😔 Θλίψη

- 😰 Άγχος

- 😨 Φόβος

- 🌱 Ελπίδα

- 🙏 Προσευχή

- ❤️ Συγχώρεση

- 🕊️ Ειρήνη

- 💪 Δύναμη

- ❓ Αμφιβολία

- 🌎 Σκοπός

- 👥 Σχέσεις

- ✨ Πίστη

- 🧭 Καθοδήγηση



Clicking a topic should show relevant Bible passages.



---



MEET JESUS



Create a major section:



Γνώρισε τον Ιησού



Sections:



Ποιος είναι ο Ιησούς;



Η ζωή Του



Τα λόγια Του



Οι παραβολές Του



Τα θαύματά Του



Ο Σταυρός



Η Ανάσταση



Γιατί έχει σημασία ο Ιησούς σήμερα;



Each section should lead naturally into relevant Gospel passages.



---



“I DON'T KNOW WHERE TO START”



Create an onboarding/discovery experience.



Headline:



Δεν ξέρεις από πού να ξεκινήσεις; Κανένα πρόβλημα.



Question:



Τι θα ήθελες να ανακαλύψεις σήμερα;



Options:



❤️ Θέλω να γνωρίσω τον Ιησού



📖 Θέλω να ξεκινήσω τη Βίβλο



🙏 Θέλω να μάθω να προσεύχομαι



😔 Περνάω μια δύσκολη περίοδο



❓ Έχω ερωτήσεις για τον Θεό



🌱 Θέλω να βρω ελπίδα



🔎 Θέλω να καταλάβω τον Χριστιανισμό



Use the answer to recommend relevant passages/reading plans.



---



READING PLANS



Create reading plans.



Initial plans:



Γνώρισε τον Ιησού σε 30 ημέρες



7 ημέρες ελπίδας



7 ημέρες προσευχής



7 ημέρες ειρήνης



14 ημέρες πίστης



Όταν περνάς δύσκολα



Show:



- Day

- Reading

- Estimated time

- Progress

- Continue button



Example:



Ημέρα 8 / 30



5 λεπτά



Συνέχισε



---



PRAYER



Create a peaceful prayer section.



Headline:



Μίλησε στον Θεό



Explain simply:



Δεν χρειάζεσαι τέλειες λέξεις. Η προσευχή μπορεί να ξεκινήσει απλά, όπως μια ειλικρινής συζήτηση.



Prompts:



Για τι είμαι ευγνώμων;



Τι με απασχολεί;



Για ποιον θέλω να προσευχηθώ;



Τι θέλω να πω στον Θεό;



Allow users to write private prayer/journal entries.



---



PROFILE



Create:



Η πορεία μου



Display:



- Continue reading

- Reading streak

- Chapters read

- Saved verses

- Highlights

- Notes

- Reading plans

- Recent passages



Gamification should be subtle.



Never make spiritual growth feel like a competition.



---



VERSE SHARING



Create beautiful social-media-friendly verse cards.



Include:



Verse



Reference



Brand identity



Buttons:



Κοινοποίηση

Αποθήκευση

Λήψη εικόνας



The visual should be optimized for Instagram Stories and mobile sharing.



---



AI BIBLE COMPANION



Create the frontend integration for a Botpress AI assistant.



Floating button:



💬 Ρώτα τον Βοηθό



Desktop:



- Floating launcher

- Chat panel



Mobile:



- Full-screen or large bottom-sheet experience



The chatbot should be accessible from:



- Homepage

- Bible reader

- Search

- Verse selection

- Topic pages

- Jesus pages



When launched from a verse, provide the selected verse as context.



Example CTA:



Ρώτησε τον Βοηθό για αυτό το εδάφιο



Do not build the Botpress backend in Lovable.



Build a clean integration component and placeholder configuration.



---



DATA ARCHITECTURE



Design the app around reusable data models.



Suggested entities:



User

Bible

Book

Chapter

Verse

Bookmark

Highlight

Note

ReadingPlan

ReadingPlanDay

UserReadingProgress

DailyVerse

Topic

TopicPassage

PrayerEntry



The Bible should be stored separately from presentation logic.



Make the project easy to connect to Supabase later.



---



TECHNICAL REQUIREMENTS



Use a modern component-based architecture.



Prioritize:



- Responsive design

- Mobile-first UX

- Fast loading

- Accessibility

- SEO

- Clean reusable components

- Secure authentication

- Database-ready architecture

- API-ready architecture



Do not create unnecessary complexity.



---



DESIGN SYSTEM



Use:



- Warm cream

- Soft white

- Charcoal

- Muted olive

- Warm neutral tones

- Subtle gold accents



Use a Greek-compatible modern font.



Large readable typography.



Rounded cards.



Subtle shadows.



Beautiful whitespace.



Soft animations.



Respect reduced-motion preferences.



Dark mode should be excellent, not an afterthought.



---



IMPORTANT CONTENT PRINCIPLES



The product should:



- Keep Jesus central.

- Encourage Bible reading.

- Welcome honest questions.

- Make Scripture approachable.

- Connect Scripture to real life.

- Avoid guilt-based UX.

- Avoid fear-based manipulation.

- Avoid judgment.

- Avoid pretending the AI is God.

- Never claim divine authority on behalf of the AI.



The website should invite users to discover rather than pressure them.



---



HOMEPAGE FINAL CTA



End with:



Ίσως σήμερα είναι η μέρα να ανοίξεις τη Βίβλο.



Button:



Ξεκίνα τώρα



Secondary:



Ρώτησε τον Βοηθό



---



BUILD PRIORITY



Build in this order:



1. Design system

2. Homepage

3. Bible architecture

4. Bible reader

5. Search

6. Verse interaction

7. Botpress integration component

8. Daily verse

9. Topics

10. Meet Jesus

11. Reading plans

12. Prayer

13. Authentication/profile

14. Saved verses/notes

15. Sharing

16. Performance/accessibility/SEO polish



The result should feel like a real, polished product — not a template.



The single most important objective is:



When a young person visits the site, they should feel curious enough to open the Bible.



Then:



Make reading easy.



Make understanding easy.



Make questions welcome.



And ultimately point them toward Jesus Christ.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://logou-cosmos.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0b66b1e1-773d-4675-ba59-a9dee2442899).

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
