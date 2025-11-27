export default function NewBook() {
  async function submitBook(formData) {
    try {
      const res = await fetch(
        "https://orif-pomy-books-library.vercel.app/api/v1/books",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Title: formData.get("title"),
            Author: formData.get("author"),
            Genre: formData.get("genre"),
            Subject: formData.get("subject"),
            Location: formData.get("location"),
          }),
        }
      );
    } catch (error) {}
  }

  return (
    <form action={submitBook} className="bookForm">
      <label htmlFor="title">Titre: </label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="author">Auteur: </label>
      <input type="text" id="author" name="author" required />
      <label htmlFor="genre">Genre: </label>
      <input type="text" id="genre" name="genre" required />
      <label htmlFor="subject">Sujet: </label>
      <input type="text" id="subject" name="subject" required />
      <label htmlFor="location">Emplacement: </label>
      <input type="text" id="location" name="location" required />
      <input type="submit" value="Envoyer" />
    </form>
  );
}