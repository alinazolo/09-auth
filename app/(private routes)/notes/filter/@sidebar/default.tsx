import Link from "next/link";
import css from "./Sidebar.module.css";
import { tags } from "@/types/note";

export default function SidebarNotes() {
  return (
      <ul className={css.menuList}>
          <li className={css.menuItem}>
              <Link   className={css.menuLink} href={`/notes/filter/all`}>All notes</Link>
          </li>
          {tags.map((tag) => (
               <li  key={tag} className={css.menuItem}>
              <Link href={`/notes/filter/${tag}`}
            className={css.menuLink}>{tag}</Link>
          </li>
          ))}
    </ul>
  );
}