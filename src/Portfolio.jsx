import React, {useEffect, useRef, useState} from 'react';
import {mountSceneMotion} from './sceneMotion';
const asset = file => '/assets/' + file;
const resume = '/downloads/cai-xinyi-general-resume.pdf';
export function App() {
  useEffect(mountSceneMotion, []);
  const dialog = useRef(null), opener = useRef(null);
  const [image, setImage] = useState(null);
  const close = () => dialog.current.close();
  const picture = (file, title) => <button className="picture" aria-label={'放大查看：' + title} onClick={event => {
    opener.current = event.currentTarget; setImage({file, title}); dialog.current.showModal();
  }}><img src={asset(file)} alt={title} loading="lazy"/><span className="caption">{title}<small>放大查看 ↗</small></span></button>;
  const person = (file, alt) => <div className="portrait"><img src={asset(file)} alt={alt}/></div>;
  const chapter = (number, title) => <p className="chapter"><span>{number}</span>{title}</p>;
  const download = <a href={resume} download="蔡昕益_创意产品策划_通用母版_详版_公开版.pdf">下载简历 ↓</a>;
  return <><a className="skip-link" href="#projects">跳到核心项目</a><main>
    <section className="scene intro" id="top"><div className="grid">
      <div className="left"><p className="eyebrow">蔡昕益 · 个人作品集</p><h1>我，<br/>不只一面<span>。</span></h1><div className="rule"/></div>
      {person('person-front-cutout.png', '正面站立的 Q 版蔡昕益')}
      <div className="right identity"><p className="eyebrow">ABOUT ME</p><h2>蔡昕益</h2><p>广州大学 · 播音与主持艺术 · 本科<br/>预计 2027.06 毕业</p>
        <p className="role">创意产品策划<br/><span>需求分析与价值表达<br/>AI 工作流与数据分析</span></p>
        <p className="lead">从需求和资料中找到表达重点，把产品理解转化为方案、内容与可复用的工作流程。</p>
        <nav className="actions" aria-label="快捷入口"><a className="primary" href="#projects">核心项目 ↗</a>{download}<a href="#contact">联系我</a></nav>
      </div></div><a className="scroll" href="#projects">向下，看看我的另一面 <span aria-hidden="true">↓</span></a>
    </section>
    <nav className="project-directory" id="projects" aria-label="项目目录"><p className="eyebrow">SELECTED WORK / 按项目阅读</p><div>
      <a href="#insight"><b>01 / AISTACK</b><span>需求、竞品、视频与展会</span></a><a href="#learn"><b>02 / AI 工作流</b><span>投标预读 Skill · n8n</span></a><a href="#story"><b>03 / 数据与内容</b><span>SQL 分析 · Spark · 新闻作品</span></a>
    </div></nav>
    <section className="scene insight" id="insight"><div className="grid"><div className="left">
      {chapter('01', '看见用户 · 产品与方案')}<h2>先看见问题，<br/>再表达产品价值。</h2>
      <p className="case-meta">实习项目 / 品高软件 / 2026.06—2026.09<br/>AI 产品分析与解决方案支持实习生</p>
      <article><h3>把技术能力整理成沟通依据</h3><p>参与 AISTACK 产品材料、客户方案与投标应答整理。围绕数据安全、模型管理、资源运营等需求，梳理能力与场景的对应关系，协助输出能力结构图和对外沟通材料。</p></article>
      <div className="relations"><article><h3>数据敏感 → 先明确调用边界</h3><p>区分本地模型处理与外部模型调用，避免将“私有化部署”直接等同于所有请求均不出域。</p></article><article><h3>接口分散 → 统一接入与管理</h3><p>在方案中组织统一 API、权限、配额和用量监控等能力，说明它们对应的管理需求。</p></article></div>
      <article className="finding"><small>竞品表中的具体判断</small><h3>部署位置之外，还要看请求去向</h3><p>以企业多模型接入场景比较 OneAPI、OpenRouter、百度千帆与 AISTACK。已有竞品表区分：调用本地预装模型可保持本地处理；配置公网渠道的请求会出域。</p><p className="note">来源：《API平台竞品分析》“数据出域”行｜实习期间的产品分析。</p></article>
      {picture('aistack-architecture.png', 'AISTACK 产品方案架构 · 参与整理的材料')}
    </div>{person('person-insight-cutout.png', '手持记录板、观察问题的 Q 版人物')}<div className="right">
      <p className="eyebrow">交付 / 视频与线下展示</p><article><h3>AISTACK API 平台宣传视频</h3><p>独立制作 API 平台部分宣传展示视频。用“重生文学”建立故事入口，将使用场景、功能亮点与真实界面组织成视听内容。</p></article>
      <ol className="steps"><li><b>叙事入口</b><span>从调用成本困扰切入</span></li><li><b>能力表达</b><span>用统一调用入口连接问题与产品</span></li><li><b>内容交付</b><span>把故事素材与界面演示组织成视频</span></li></ol>
      <div className="story-frames">{picture('story-problem.jpg', '视频节选截图 / 调用成本困扰')}{picture('story-solution.jpg', '视频节选截图 / 统一调用入口')}{picture('story-interface.jpg', '视频节选截图 / API 密钥管理（已遮盖）')}</div>
      <article><h3>OPC 展会协作</h3><p>参与 AISTACK 大湾区人工智能 OPC 线下展会策划，协助梳理展示重点、宣传物料与现场沟通信息。</p></article>{picture('opc.jpg', 'OPC 展会现场｜参与展示策划与物料协作')}
    </div></div></section>
    <section className="scene learn" id="learn"><div className="grid"><div className="left">
      {chapter('02', 'AI 工作流 · 从任务到方法')}<h2>先拆解任务，<br/>再组织工具。</h2><p className="lead">把信息采集和长文档预读拆成可检查的步骤，将需要人判断的环节保留下来。</p>
      <article><small>品高实习实践 / 2026.06—2026.09</small><h3>投标预读 Skill</h3><p>面向招标材料预读，将技术指标、交付要求、评分规则与废标风险组织为结构化流程，沉淀事实提取、证据定位、风险扫描和交付检查规则。</p></article>
      <ol className="path"><li><b>01 / 事实提取</b><p>区分文件事实、分析判断和信息缺口。</p></li><li><b>02 / 证据定位</b><p>关键结论要求标注文件及页码、章节或关键词。</p></li><li><b>03 / 风险与交付检查</b><p>梳理门槛、评分和风险；信息不足时保留待澄清条件。</p></li></ol>
      <article className="finding"><h3>实际产物：规则包与分析报告</h3><p>形成 Skill 规则包、分析框架、报告模板与检查清单，输出包含决策摘要、供应商资格、风险分析和待澄清事项的预读报告。</p></article>
      <details className="skill-example"><summary>查看真实报告节选：要求、来源与待办</summary>
        <p className="note">AI 智能服务器一体机｜预读报告 V3.0 · 2026.07.06。以下为报告内容节选，来源栏沿用报告中的章节标注。</p>
        <article><h3>识别供应商门槛</h3><p><b>提取结果：</b>CPU 厂商出具稳定供应承诺函 + 供应商正品保障承诺函。</p><p><b>报告标注来源：</b>第三章表 3-2。</p><p><b>报告建议：</b>提前联系 CPU 厂商。</p></article>
        <article><h3>将交付要求转成澄清问题</h3><p><b>待澄清事项：</b>标准产品供货周期（是否满足 30 天交付）。</p><p><b>报告标注来源：</b>第一章一。</p><p><b>建议确认方式：</b>向硬件厂商书面确认。</p></article>
        <p>把长文档中的要求整理为“要准备什么、依据在哪里、下一步向谁确认”，供投标前人工复核与沟通使用。</p>
      </details>
    </div>{person('person-learn-cutout.png', '向上观察学习节点的 Q 版人物')}<div className="right">
      <p className="eyebrow">独立实践 / n8n 多源资讯工作流</p>{picture('n8n.jpg', 'n8n 多源资讯工作流｜手动触发流程实践')}
      <article><h3>从资讯源到结构化归档</h3><p>面向市场信息追踪与策划资料整理，搭建多源资讯采集、AI 分类和结构化处理链路，连接飞书多维表格归档节点，开展手动触发流程实践。</p></article>
      <ol className="steps"><li><b>输入</b><span>多个 RSS 与 HTTP 资讯源</span></li><li><b>处理</b><span>字段整理、筛选、LLM 与结构化解析</span></li><li><b>输出节点</b><span>飞书多维表格新增记录</span></li></ol>
      <p className="skills">任务拆解 / 证据意识 / AI 应用</p>
    </div></div></section>
    <section className="scene story" id="story"><div className="grid"><div className="left">
      {chapter('03', '数据与内容 · 从分析到表达')}<h2>理解行为，<br/>也理解观看的人。</h2>
      <article><small>公开数据集 / 独立分析</small><h3>Retailrocket 电商用户行为分析</h3><p>自学 SQL，使用 MySQL 提取、清洗 Retailrocket 公开数据，按行为类型统计去重用户，以 Excel 输出图表与分析文档。</p><p>原始样本含 2,756,101 条行为记录。浏览去重用户 1,404,179 人，加购去重用户 37,722 人，两者数量比为 2.69%。完成浏览、加购与购买用户规模对比，整理详情页与加购引导等待验证优化方向。</p>
        <table className="analysis-table"><caption>各类行为的去重用户数</caption><thead><tr><th scope="col">行为</th><th scope="col">用户数</th><th scope="col">相对浏览人数</th></tr></thead><tbody><tr><th scope="row">浏览</th><td>1,404,179</td><td>100%</td></tr><tr><th scope="row">加购</th><td>37,722</td><td>2.69%</td></tr><tr><th scope="row">购买</th><td>11,719</td><td>0.83%</td></tr></tbody></table>
        <p className="note">数据：Retailrocket events.csv，2015.05.03—2015.09.18（UTC）。全样本按行为类型分别去重 visitorid；人数比未限定行为先后、同一商品或同一会话。</p></article>
      <article><small>实习项目 / 知君竹传媒 / 2025.07—2025.10</small><h3>Spark 音箱内容策划</h3><p>参与 SEO 项目，梳理竞品内容与用户需求，输出平台内容定位方案；以艺人圈层为切入点组织产品卖点与图文表达，个人产出小红书图文 200+ 条；配合渠道经理推进团队和品牌方的节点交付。</p></article>{picture('spark.jpg', 'Spark 图文内容样例')}
      <article><h3>社群与活动协作</h3><p>参与人工智能玄学产品私域运营，协助活动策划和产品推广，参与维护五百余人社群，并根据反馈调整内容与活动形式。</p></article>
    </div>{person('person-story-cutout.png', '手持场记板、向外讲述的 Q 版人物')}<div className="right">
      <p className="eyebrow">内容作品 / 新闻短视频</p><p className="case-meta">广东省广播电视台 / 2025.01—2025.03<br/>新媒体运营实习生</p>
      <article><h3>突发新闻的内容执行</h3><p>围绕突发新闻独立创作并发布短视频，兼顾事件重点与时效传播。代表作品记录如下。</p></article>
      <dl className="news-metrics"><div><dt>播放</dt><dd>7495万+</dd></div><div><dt>点赞</dt><dd>13.9万+</dd></div><div><dt>分享</dt><dd>44.3万+</dd></div></dl>
      <p className="note">历史作品截图：广东云浮烟花安全事件，作品发布于 2025.02.14 14:27。统计截止时间未记录。</p>
      <details><summary>展开新闻作品与数据证据</summary>{picture('news-evidence.jpg', '新闻作品历史截图 · 发布日期 2025.02.14')}</details>
      <article><h3>直播现场协作</h3><p>担任元宵晚会与荔枝湾民俗文化活动直播拍摄助理，协助现场调度与多方配合。</p></article><p className="skills">行为分析 / 内容策划 / 项目协同</p>
    </div></div></section>
    <section className="scene grow" id="grow"><div className="grid"><div className="left">
      {chapter('04', '课程与校园 · 策划实践')}<h2>把一个想法，<br/>组织成完整方案。</h2><p className="case-meta">广州大学 / 2025 / 课程模拟项目 · 组长</p>
      <article><h3>Mate80 产品发布会营销策划</h3><p>统筹消费者调研、问卷设计、竞品分析与团队分工，推进产品卖点定位和营销方案输出。</p><p>方案把科技爱好者、户外人群与商务人群作为目标群体，并将信号连接痛点组织为“永远在线”的传播方向，设计预热、发布、续热三阶段节奏。</p><p className="note">课程模拟项目｜人群与定位为方案设定，预算与目标为预设。</p></article>{picture('marketing-audience.jpg', '课程模拟 / 目标人群与定位分析')}
    </div>{person('person-grow-cutout.png', '俯看能力拼图的 Q 版人物')}<div className="right">
      <p className="eyebrow">方案产物 / 三阶段传播节奏</p>{picture('marketing-plan.jpg', '课程模拟 / 预热、发布与续热')}
      <article><small>校园补充实践</small><h3>校园文化 IP 周边盲盒</h3><p>参与创意策划、用户调研和上线流程，围绕校园文化形象组织创意方向。</p></article><p className="skills">营销策划 / 团队分工 / 创意协作</p>
    </div></div></section>
    <section className="scene closing" id="contact"><div className="grid">
      <div className="left"><h2>不只一面<span>。</span></h2><p className="ending">希望下一次见面，<br/>不只是面试。</p></div>{person('person-real-cutout.png', '蔡昕益向镜头伸手的形象图')}
      <div className="right contact"><h3>蔡昕益</h3><p>创意产品策划</p><a href="mailto:2763841742@qq.com">2763841742@qq.com ↗</a><nav className="actions" aria-label="联系与简历">{download}<a href="#projects">回到项目目录 ↑</a></nav><p className="note">简历更新：2026.09</p></div>
    </div></section>
  </main><dialog ref={dialog} className="lightbox" aria-labelledby="image-title" onClick={event => {if(event.target === event.currentTarget) close();}} onClose={() => opener.current?.focus({preventScroll:true})}>
    <div className="modal-header"><p id="image-title">{image?.title}</p><button onClick={close} autoFocus>关闭</button></div>{image && <img src={asset(image.file)} alt={image.title}/>}
  </dialog></>;
}
