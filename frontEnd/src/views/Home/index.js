import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import * as S from "./styles";
import api from "../../services/api";
import isConnected from "../../utils/isConnected";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FilterCard from "../../components/FilterCard";
import TaskCard from "../../components/TaskCard";

function Home() {
  const [filterActived, setFilterActived] = useState("all");
  const [tasks, setTask] = useState([]);
  const [redirect, setRedirect] = useState(false);

  async function loadTask() {
    await api
      .get(`/task/filter/${filterActived}/${isConnected}`)
      .then((response) => {
        setTask(response.data);
      });
  }
  function notification() {
    return setFilterActived("late");
  }
  useEffect(() => {
    loadTask();

    if (!isConnected) setRedirect(true);
  }, [filterActived]);

  return (
    <S.Container>
      {redirect && <Redirect to="/qrcode" />}
      <Header clickNotification={notification} />
      <S.FilterArea>
        <button type="button" onClick={() => setFilterActived("all")}>
          <FilterCard title="Todos" actived={filterActived === "all"} />
        </button>
        <button type="button" onClick={() => setFilterActived("today")}>
          <FilterCard title="Hoje" actived={filterActived === "today"} />
        </button>
        <button type="button" onClick={() => setFilterActived("week")}>
          <FilterCard title="Semana" actived={filterActived === "week"} />
        </button>
        <button type="button" onClick={() => setFilterActived("month")}>
          <FilterCard title="Mês" actived={filterActived === "month"} />
        </button>
        <button type="button" onClick={() => setFilterActived("year")}>
          <FilterCard title="Ano" actived={filterActived === "year"} />
        </button>
      </S.FilterArea>

      <S.Title>
        <h3 id="line">
          {filterActived === "late" ? "TAREFAS ATRASADAS" : "TAREFAS"}
        </h3>
      </S.Title>

      <S.Content>
        {tasks.map((el) => (
          <div key={`${el._id}`}>
            <Link to={`/task/${el._id}`}>
              <TaskCard
                type={el.type}
                title={el.title}
                when={el.when}
                done={el.done}
              />
            </Link>
          </div>
        ))}
      </S.Content>
      <Footer />
    </S.Container>
  );
}

export default Home;
